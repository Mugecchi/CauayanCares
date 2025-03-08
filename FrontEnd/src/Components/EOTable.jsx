import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	Select,
	MenuItem,
	TextField,
	TablePagination,
} from "@mui/material";
import { Delete, Visibility, Download, Close } from "@mui/icons-material";

const BASE_URL = "http://localhost:5000";

const EOTable = () => {
	const [ordinances, setOrdinances] = useState([]);
	const [openPreview, setOpenPreview] = useState(false);
	const [selectedFile, setSelectedFile] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	useEffect(() => {
		fetchOrdinances();
	}, []);

	const fetchOrdinances = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/api/ordinances`);
			setOrdinances(response.data);
		} catch (error) {
			console.error("Error fetching ordinances:", error);
		}
	};

	const handlePreview = (filePath) => {
		setSelectedFile(`${BASE_URL}/uploads/${filePath}`);
		setOpenPreview(true);
	};

	const handleDownload = (filePath) => {
		const link = document.createElement("a");
		link.href = `${BASE_URL}/uploads/${filePath}`;
		link.download = filePath;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this ordinance?")) {
			try {
				await axios.delete(`${BASE_URL}/api/ordinances/${id}`);
				fetchOrdinances();
			} catch (error) {
				console.error("Error deleting ordinance:", error);
			}
		}
	};

	const handleStatusChange = async (id, newStatus) => {
		try {
			await axios.put(
				`${BASE_URL}/api/ordinances/${id}`,
				{ status: newStatus },
				{ headers: { "Content-Type": "application/json" } }
			);
			fetchOrdinances();
		} catch (error) {
			console.error(
				"Error updating status:",
				error.response ? error.response.data : error.message
			);
			alert("Failed to update status. Check console for details.");
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

	const filteredOrdinances = ordinances.filter((ordinance) =>
		Object.entries(ordinance)
			.filter(([key]) => key !== "file_path") // Exclude `file_path`
			.some(
				([_, value]) =>
					value &&
					value.toString().toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	return (
		<div>
			<TextField
				label="Search Ordinance"
				variant="outlined"
				fullWidth
				margin="normal"
				value={searchQuery}
				onChange={handleSearchChange}
				sx={{ backgroundColor: "white" }}
			/>

			<TableContainer component={Paper} sx={{ minHeight: 400 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Type of Document</TableCell>
							<TableCell>Number</TableCell>
							<TableCell>Policies</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((ordinance) => (
								<TableRow key={ordinance.id}>
									<TableCell>{ordinance.title}</TableCell>
									<TableCell>{ordinance.document_type}</TableCell>
									<TableCell>{ordinance.number}</TableCell>
									<TableCell>{ordinance.policies}</TableCell>
									<TableCell>
										<Select
											value={ordinance.status}
											onChange={(e) =>
												handleStatusChange(ordinance.id, e.target.value)
											}
										>
											{[
												"Pending",
												"Approved",
												"Implemented",
												"Under Review",
												"Amended",
											].map((option) => (
												<MenuItem key={option} value={option}>
													{option}
												</MenuItem>
											))}
										</Select>
									</TableCell>
									<TableCell>
										{ordinance.file_path && (
											<>
												<IconButton
													onClick={() => handlePreview(ordinance.file_path)}
												>
													<Visibility />
												</IconButton>
												<IconButton
													onClick={() => handleDownload(ordinance.file_path)}
												>
													<Download />
												</IconButton>
											</>
										)}
										<IconButton
											onClick={() => handleDelete(ordinance.id)}
											color="error"
										>
											<Delete />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={filteredOrdinances.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handleRowsPerPageChange}
			/>

			{/* Preview Modal */}
			<Dialog
				open={openPreview}
				onClose={() => setOpenPreview(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					File Preview
					<IconButton
						onClick={() => setOpenPreview(false)}
						style={{ float: "right" }}
					>
						<Close />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					{selectedFile ? (
						<iframe
							src={selectedFile}
							title="File Preview"
							width="100%"
							height="500px"
							style={{ border: "none" }}
						/>
					) : (
						<Typography>No file selected.</Typography>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default EOTable;
