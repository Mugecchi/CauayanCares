import React, { useEffect, useState } from "react";
import { deleteOrdinance, fetchOrdinances, handlePreview } from "../api";
import {
	Snackbar,
	Alert,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Dialog,
	Tooltip,
	IconButton,
	DialogContent,
	DialogTitle,
	TablePagination,
	TextField,
	Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
function EOTable() {
	const [records, setRecords] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [selectedFile, setSelectedFile] = useState("");
	const [filteredRecords, setFilteredRecords] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [openPreview, setOpenPreview] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [error, setError] = useState({
		open: false,
		message: "",
		severity: "info",
	});
	useEffect(() => {
		const cached = localStorage.getItem("eoTableState");
		if (cached && JSON.parse(cached).records?.length > 0) return;

		const getRecords = async () => {
			try {
				const res = await fetchOrdinances(page + 1, rowsPerPage);
				if (res.ordinances.length === 0) {
					setError({ message: "No Records found.", severity: "error" });
					setRecords([]);
					setFilteredRecords([]);
				} else {
					setError({
						message: "Records fetched Successfully",
						severity: "success",
					});
					setRecords(res.ordinances);
					setFilteredRecords(res.ordinances);
				}
				setTotalPages(res.total_pages);
			} catch (error) {
				setError({
					message: "An error occurred while fetching ordinances.",
					severity: "error",
				});
			}
		};

		getRecords();
	}, [page, rowsPerPage]);

	// Update filtered data when searchQuery or records change
	useEffect(() => {
		// Load state from localStorage on mount
		const cachedData = localStorage.getItem("eoTableState");
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			setRecords(parsed.records || []);
			setFilteredRecords(parsed.filteredRecords || []);
			setPage(parsed.page || 0);
			setRowsPerPage(parsed.rowsPerPage || 10);
			setSearchQuery(parsed.searchQuery || "");
			setSelectedStatus(parsed.selectedStatus || "");
			setTotalPages(parsed.totalPages || 1);
		}
	}, []);

	useEffect(() => {
		// Save state to localStorage on every change
		localStorage.setItem(
			"eoTableState",
			JSON.stringify({
				records,
				filteredRecords,
				page,
				rowsPerPage,
				searchQuery,
				selectedStatus,
				totalPages,
			})
		);
	}, [
		records,
		filteredRecords,
		page,
		rowsPerPage,
		searchQuery,
		selectedStatus,
		totalPages,
	]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this record?")) {
			try {
				await deleteOrdinance(id);
				setRecords((prev) => prev.filter((record) => record.id !== id));
				setFilteredRecords((prev) => prev.filter((record) => record.id !== id));
				setError({
					message: "Record deleted successfully.",
					severity: "success",
				});
			} catch (error) {
				console.error("Error deleting record:", error);
				setError({
					message: "An error occurred while deleting the record.",
					severity: "error",
				});
			}
		}
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};
	return (
		<div>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<TextField
					label="Search by Title or Status"
					variant="outlined"
					margin="normal"
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<TextField
					select
					label="Filter by Document Type"
					value={selectedStatus}
					onChange={(e) => setSelectedStatus(e.target.value)}
					SelectProps={{ native: true }}
					variant="outlined"
					margin="normal"
				>
					<option value=""> </option>
					<option value="Executive Order">Executive Order</option>
					<option value="Ordinance">Ordinance</option>
					<option value="Memo">Memo</option>
					<option value="Resolution">Resolution</option>
				</TextField>
			</Box>

			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Details</TableCell>
							<TableCell>Series No.</TableCell>
							<TableCell>Document Type</TableCell>
							<TableCell>Date Issued</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredRecords.map((record) => (
							<TableRow key={record.id}>
								<TableCell>{record.title}</TableCell>
								<TableCell>{record.status}</TableCell>
								<TableCell>{record.details}</TableCell>
								<TableCell>{record.number}</TableCell>
								<TableCell>{record.document_type}</TableCell>
								<TableCell>
									{new Date(record.date_issued).toLocaleDateString()}
								</TableCell>

								<TableCell>
									{record.file_path && (
										<Tooltip title="Preview File" arrow>
											<IconButton
												onClick={() =>
													handlePreview(
														record.file_path,
														setSelectedFile,
														setOpenPreview
													)
												}
											>
												<img src="/Printer.svg" alt="preview" />
											</IconButton>
										</Tooltip>
									)}

									<Tooltip title="Delete Ordinance" arrow>
										<IconButton
											onClick={() => handleDelete(record.id)}
											color="error"
										>
											<img src="/trash.svg" alt="delete" />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
				<TablePagination
					component="div"
					count={totalPages * rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					rowsPerPageOptions={[10, 25, 50]}
				/>
			</Box>
			<Snackbar
				open={!!error.message}
				autoHideDuration={4000}
				onClose={() => setError({ open: false, message: "", severity: "info" })}
			>
				<Alert
					onClose={() =>
						setError({ open: false, message: "", severity: "info" })
					}
					severity={error.severity || "info"}
					sx={{ width: "100%" }}
				>
					{error.message}
				</Alert>
			</Snackbar>
			{/* Preview Modal */}
			<Dialog
				open={openPreview}
				onClose={() => setOpenPreview(false)}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle>
					Preview Records
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
}

export default EOTable;
