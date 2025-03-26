import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	TablePagination,
	Button,
	Box,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Avatar,
} from "@mui/material";
import { Close, Add, PhotoCamera } from "@mui/icons-material";
import { getAvatarUrl } from "../api";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api";

const Registration = () => {
	const [users, setUsers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [openForm, setOpenForm] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);

	// User Form Data
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		role: "user",
		user_firstname: "",
		user_middlename: "",
		user_lastname: "",
		user_office: "",
		user_email: "",
		user_image: null,
	});

	useEffect(() => {
		loadUsers();
	}, []);

	const loadUsers = async () => {
		try {
			const usersData = await fetchUsers();
			setUsers(usersData);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				await deleteUser(id);
				loadUsers();
			} catch (error) {
				console.error("Error deleting user:", error);
				alert("Failed to delete the user.");
			}
		}
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleOpenForm = (user = null) => {
		if (user) {
			setEditMode(true);
			setSelectedUserId(user.id);
			setFormData({
				username: user.username,
				password: "",
				role: user.role,
				user_firstname: user.user_firstname,
				user_middlename: user.user_middlename,
				user_lastname: user.user_lastname,
				user_office: user.user_office,
				user_email: user.user_email,
				user_image: user.user_image,
			});
			setSelectedImage(user.user_image);
		} else {
			setEditMode(false);
			setFormData({
				username: "",
				password: "",
				role: "user",
				user_firstname: "",
				user_middlename: "",
				user_lastname: "",
				user_office: "",
				user_email: "",
				user_image: null,
			});
			setSelectedImage(null);
		}
		setOpenForm(true);
	};

	const handleCloseForm = () => {
		setOpenForm(false);
		setEditMode(false);
		setSelectedUserId(null);
		setSelectedImage(null);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			setSelectedImage(URL.createObjectURL(file));
			setFormData({ ...formData, user_image: file });

			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("username", formData.username); // ✅ ADD THIS
			formDataToSend.append("role", formData.role);
			formDataToSend.append("user_firstname", formData.user_firstname);
			formDataToSend.append("user_middlename", formData.user_middlename);
			formDataToSend.append("user_lastname", formData.user_lastname);
			formDataToSend.append("user_office", formData.user_office);
			formDataToSend.append("user_email", formData.user_email);

			if (!editMode && formData.password.trim() === "") {
				alert("Password is required for new users!");
				return;
			}

			if (formData.password.trim()) {
				formDataToSend.append("password", formData.password);
			}

			if (formData.user_image instanceof File) {
				formDataToSend.append("user_image", formData.user_image);
			}

			if (editMode) {
				await updateUser(selectedUserId, formDataToSend);
			} else {
				await createUser(formDataToSend);
			}

			alert(
				editMode ? "User updated successfully!" : "User added successfully!"
			);
			loadUsers();
			handleCloseForm();
		} catch (error) {
			console.error(
				"Error saving user:",
				error.response?.data?.error || error.message
			);
			alert(
				"Failed to save user: " + (error.response?.data?.error || error.message)
			);
		}
	};

	const filteredUsers = users.filter((user) =>
		Object.entries(user)
			.filter(([key]) => key !== "password")
			.some(
				([_, value]) =>
					value &&
					value.toString().toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	return (
		<div>
			<Box display="flex" justifyContent="space-between">
				<TextField
					label="Search User"
					variant="outlined"
					margin="normal"
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<Button
					variant="contained"
					startIcon={<Add />}
					onClick={() => handleOpenForm()}
				>
					Add User
				</Button>
			</Box>
			<TableContainer>
				<Table stickyHeader size="medium">
					<TableHead>
						<TableRow>
							<TableCell>Profile</TableCell>
							<TableCell>Username</TableCell>
							<TableCell>Full Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Office</TableCell>
							<TableCell>Role</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUsers
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((user) => (
								<TableRow key={user.id} hover>
									<TableCell>
										<TableCell>
											<Avatar
												src={
													user.user_image
														? getAvatarUrl(user.user_image)
														: "/default-avatar.png"
												}
												alt={user.username}
											/>
										</TableCell>
									</TableCell>
									<TableCell>{user.username}</TableCell>
									<TableCell>{`${user.user_firstname} ${user.user_middlename} ${user.user_lastname}`}</TableCell>
									<TableCell>{user.user_email}</TableCell>
									<TableCell>{user.user_office}</TableCell>
									<TableCell>{user.role}</TableCell>
									<TableCell>
										<Button onClick={() => handleOpenForm(user)}>Edit</Button>
										<Button color="error" onClick={() => handleDelete(user.id)}>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			{/* Add/Edit User Modal */}
			<Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
				<DialogTitle>
					{editMode ? "Edit User" : "Add User"}
					<IconButton onClick={handleCloseForm} style={{ float: "right" }}>
						<Close />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<form onSubmit={handleSubmit}>
						{/* Profile Picture Upload */}
						<Box display="flex" alignItems="center" gap={2} mb={2}>
							<Avatar src={selectedImage} sx={{ width: 80, height: 80 }} />
							<Button component="label">
								<PhotoCamera />
								<input
									type="file"
									hidden
									accept="image/*"
									onChange={handleImageUpload}
								/>
							</Button>
						</Box>

						{/* Username */}
						<TextField
							label="Username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							fullWidth
							margin="normal"
							required
							disabled={editMode} // Prevents editing username for existing users
						/>

						{/* Password (New user = required, Existing user = optional) */}
						<TextField
							label={
								editMode
									? "New Password (Leave blank to keep current password)"
									: "Password"
							}
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							fullWidth
							margin="normal"
							required={!editMode} // Required only for new users
						/>

						{/* First Name */}
						<TextField
							label="First Name"
							name="user_firstname"
							value={formData.user_firstname}
							onChange={handleChange}
							fullWidth
							margin="normal"
							required
						/>

						{/* Middle Name */}
						<TextField
							label="Middle Name"
							name="user_middlename"
							value={formData.user_middlename}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>

						{/* Last Name */}
						<TextField
							label="Last Name"
							name="user_lastname"
							value={formData.user_lastname}
							onChange={handleChange}
							fullWidth
							margin="normal"
							required
						/>

						{/* Office */}
						<TextField
							label="Office"
							name="user_office"
							value={formData.user_office}
							onChange={handleChange}
							fullWidth
							margin="normal"
							required
						/>

						{/* Email */}
						<TextField
							label="Email"
							name="user_email"
							type="email"
							value={formData.user_email}
							onChange={handleChange}
							fullWidth
							margin="normal"
							required
						/>

						{/* Role Selection */}
						<FormControl fullWidth margin="normal">
							<InputLabel>Role</InputLabel>
							<Select
								name="role"
								value={formData.role}
								onChange={handleChange}
								required
							>
								<MenuItem value="admin">Admin</MenuItem>
								<MenuItem value="user">User</MenuItem>
							</Select>
						</FormControl>

						{/* Submit Button */}
						<Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
							{editMode ? "Update User" : "Add User"}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Registration;
