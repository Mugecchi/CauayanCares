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
} from "@mui/material";
import { Close, Add } from "@mui/icons-material";
import { fetchOrdinances, deleteOrdinance } from "../api";
import EOForms from "./EOForms";

const BASE_URL = "http://localhost:5000";

const EOTable = () => {
	const [ordinances, setOrdinances] = useState([]);
	const [openPreview, setOpenPreview] = useState(false);
	const [selectedFile, setSelectedFile] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [openForm, setOpenForm] = useState(false);

	useEffect(() => {
		fetchOrdinancesData();
	}, []);

	const fetchOrdinancesData = async () => {
		try {
			const ordinancesData = await fetchOrdinances();
			setOrdinances(ordinancesData);
		} catch (error) {
			console.error("Error fetching ordinances:", error);
		}
	};

	const handlePreview = (filePath) => {
		if (!filePath) {
			console.error("Error: No file path provided.");
			alert("File not found.");
			return;
		}

		const previewUrl = `${BASE_URL}/uploads/${filePath}`;
		console.log("Previewing file:", previewUrl);

		setSelectedFile(previewUrl);
		setOpenPreview(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this ordinance?")) {
			try {
				await deleteOrdinance(id);
				fetchOrdinancesData();
			} catch (error) {
				console.error("Error deleting ordinance:", error);
				alert("Failed to delete the ordinance.");
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

	const filteredOrdinances = ordinances.filter((ordinance) =>
		Object.entries(ordinance)
			.filter(([key]) => key !== "file_path")
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
					label="Search Record"
					variant="outlined"
					margin="normal"
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<Button
					sx={{ height: "3rem", backgroundColor: "var(--eminence)" }}
					variant="contained"
					startIcon={<Add />}
					onClick={() => setOpenForm(true)}
				>
					Add Ordinance
				</Button>
			</Box>
			<TableContainer
				sx={{ overflowY: "auto", maxHeight: "calc(70vh - 10px)" }}
			>
				<Table stickyHeader size="medium">
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Type of Document</TableCell>
							<TableCell>Number</TableCell>
							<TableCell>Details</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((ordinance) => (
								<TableRow key={ordinance.id} hover>
									<TableCell>{ordinance.title}</TableCell>
									<TableCell>{ordinance.document_type}</TableCell>
									<TableCell>{ordinance.number}</TableCell>
									<TableCell>{ordinance.details}</TableCell>
									<TableCell>{ordinance.status}</TableCell>
									<TableCell>
										{ordinance.file_path && (
											<IconButton
												onClick={() => handlePreview(ordinance.file_path)}
											>
												<img src="/Printer.svg" alt="preview" />
											</IconButton>
										)}

										<IconButton
											onClick={() => handleDelete(ordinance.id)}
											color="error"
										>
											<img src="/trash.svg" alt="delete" />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>

			<Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
				<TablePagination
					rowsPerPageOptions={[10, 20, 100]}
					component="div"
					count={filteredOrdinances.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleRowsPerPageChange}
				/>
			</Box>
			{/* Add Ordinance Modal */}
			<Dialog
				open={openForm}
				onClose={() => setOpenForm(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					Add Ordinance
					<IconButton
						onClick={() => setOpenForm(false)}
						style={{ float: "right" }}
					>
						<Close />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<EOForms
						onClose={() => setOpenForm(false)}
						refreshData={fetchOrdinancesData}
					/>
				</DialogContent>
			</Dialog>

			{/* Preview Modal */}
			<Dialog
				open={openPreview}
				onClose={() => setOpenPreview(false)}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle>
					Preview Ordinance
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
							width="100%"
							height="600px"
							title="Ordinance Preview"
							style={{ border: "none" }}
						></iframe>
					) : (
						<p>No file selected.</p>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default EOTable;
