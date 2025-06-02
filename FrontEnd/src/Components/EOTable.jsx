import React, { useEffect, useState } from "react";
import {
	apiCall,
	deleteOrdinance,
	fetchOrdinances,
	handlePreview,
	updateOrdinance,
} from "../api";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Close from "@mui/icons-material/Close";
import PrintTableSummary from "../Includes/PrintTableSummary";
function EOTable() {
	const [records, setRecords] = useState([]);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [selectedFile, setSelectedFile] = useState("");
	const [filteredRecords, setFilteredRecords] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [openPreview, setOpenPreview] = useState(false);
	const [totalPages, setTotalPages] = useState(10);
	const [searchQuery, setSearchQuery] = useState("");
	const [documentType, setDocumentType] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

	const [error, setError] = useState({
		open: false,
		message: "",
		severity: "info",
	});
	const [editableFields, setEditableFields] = useState({
		title: true,
		status: true,
		details: true,
		document_type: true,
		date_issued: true,
		number: true, // example: 'number' is not editable
		file_path: false, // example: 'file_path' is not editable
		date_effectivity: true, // example: 'date_effectivity' is not editable
	});
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);

			if (searchQuery.trim() === "") {
				setRowsPerPage(10); // Reset to default if search is empty
			} else {
				setRowsPerPage(totalPages);
			}
		}, 400); // Adjust delay as needed

		return () => clearTimeout(handler); // cleanup on change
	}, [searchQuery, totalPages]);

	const handleSave = async () => {
		// Filter out non-editable fields before sending the payload
		const payload = {};
		for (let key in selectedRecord) {
			if (editableFields[key]) {
				payload[key] = selectedRecord[key];
			}
		}

		try {
			// Send only editable fields
			await updateOrdinance(selectedRecord.id, payload);
			console.log("Ordinance updated successfully.");

			// Optionally show success toast or update UI
			setError({
				open: true,
				message: "Record Updated Successfully",
				severity: "success",
			});
			setOpenEdit(false);

			// Refetch the records after successfully saving
			await getRecords();
		} catch (error) {
			console.error("Failed to update ordinance:", error);
			// Optionally show error message to user
		}
	};
	const getRecords = async () => {
		try {
			// Pass searchQuery along with pagination info to the backend
			const res = await fetchOrdinances(
				page + 1,
				rowsPerPage,
				debouncedSearchQuery,
				documentType
			);
			if (res.ordinances.length === 0) {
				setError({ message: "No Records found.", severity: "error" });
				setRecords([]);
				setFilteredRecords([]);
			} else {
				setRecords(res.ordinances);
				setFilteredRecords(res.ordinances);
				setTotalPages(res.total_count);
			}
			setTotalPages(res.total_count);
		} catch (error) {
			setError({
				message: "An error occurred while fetching ordinances.",
				severity: "error",
			});
		}
	};

	useEffect(() => {
		getRecords();
	}, [page, rowsPerPage, debouncedSearchQuery, documentType]); // Add debouncedSearchQuery as a dependency

	useEffect(() => {
		// Helper to normalize date string: convert to Date then to "YYYY-M-D" without leading zeros
		const normalizeDate = (dateStr) => {
			if (!dateStr) return "";
			const date = new Date(dateStr);
			if (isNaN(date)) return dateStr; // fallback if invalid
			return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
		};

		if (records && records.length > 0) {
			const normalizedSearch = debouncedSearchQuery.trim().toLowerCase();

			const filtered = records.filter((record) => {
				const normalizedDate = normalizeDate(record.date_issued).toLowerCase();

				const matchesQuery =
					(record.title &&
						record.title.toLowerCase().includes(normalizedSearch)) ||
					(record.document_type &&
						record.document_type.toLowerCase().includes(normalizedSearch)) ||
					(record.status &&
						record.status.toLowerCase().includes(normalizedSearch)) ||
					(record.number &&
						record.number.toLowerCase().includes(normalizedSearch)) ||
					(normalizedDate && normalizedDate.includes(normalizedSearch));

				const matchesType =
					!documentType || record.document_type === documentType;

				return matchesQuery && matchesType;
			});

			setFilteredRecords(filtered);
		} else {
			setFilteredRecords([]);
		}
	}, [debouncedSearchQuery, documentType, records]);

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

	const handleDocumentTypeChange = (event) => {
		setDocumentType(event.target.value);
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};
	const uniqueDocumentTypes = [
		"All",
		"Ordinance",
		"Executive Order",
		"Memo",
		"Resolution",
	];

	return (
		<div>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				gap={2}
				flexWrap="wrap"
			>
				<Box>
					<TextField
						label="Search Record"
						variant="outlined"
						margin="normal"
						sx={{ marginRight: 1 }}
						value={searchQuery}
						onChange={handleSearchChange}
					/>

					<FormControl
						variant="outlined"
						margin="normal"
						sx={{ minWidth: 200 }}
					>
						<InputLabel>Document Type</InputLabel>
						<Select
							value={documentType}
							onChange={handleDocumentTypeChange}
							label="Document Type"
						>
							{uniqueDocumentTypes.map((type, idx) => (
								<MenuItem key={idx} value={type === "All" ? "" : type}>
									{type}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
				<Box>
					<PrintTableSummary
						onClick={() => {
							setRowsPerPage(totalPages);
						}}
						ordinances={filteredRecords}
					/>
				</Box>
			</Box>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Series No.</TableCell>
							<TableCell>Document Type</TableCell>
							<TableCell>Date Issued</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredRecords.map((record) => (
							<TableRow key={record.id}>
								<Tooltip title={record.title} arrow placement="top-start">
									<TableCell>{record.title}</TableCell>
								</Tooltip>
								<Tooltip title={record.status} arrow placement="top-start">
									<TableCell>{record.status}</TableCell>
								</Tooltip>

								<Tooltip title={record.number} arrow placement="top-start">
									<TableCell>{record.number}</TableCell>
								</Tooltip>

								<Tooltip
									title={record.document_type}
									arrow
									placement="top-start"
								>
									<TableCell>{record.document_type}</TableCell>
								</Tooltip>

								<Tooltip
									title={new Date(record.date_issued).toLocaleDateString()}
									arrow
									placement="top-start"
								>
									<TableCell>
										{new Date(record.date_issued).toLocaleDateString()}
									</TableCell>
								</Tooltip>
								<TableCell>
									{record.file_path && (
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
									)}

									<IconButton
										onClick={() => handleDelete(record.id)}
										color="error"
									>
										<img src="/trash.svg" alt="delete" />
									</IconButton>
									<IconButton
										onClick={() => {
											setSelectedRecord(record);
											setOpenEdit(true);
										}}
										color="primary"
									>
										<img src="/edit.svg" alt="edit" />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				{typeof totalPages === "number" && totalPages > 0 && (
					<TablePagination
						component="div"
						count={totalPages}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={[10, 25, 50, 100, totalPages]}
					/>
				)}
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
			<Dialog open={openPreview} onClose={() => setOpenPreview(false)}>
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

			<Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
				<DialogTitle>Edit Ordinance</DialogTitle>
				<DialogContent>
					<TextField
						label="Title"
						fullWidth
						margin="dense"
						value={selectedRecord?.title || ""}
						onChange={(e) =>
							setSelectedRecord({ ...selectedRecord, title: e.target.value })
						}
					/>
					<FormControl fullWidth>
						<InputLabel>Status</InputLabel>
						<Select
							label="Status"
							margin="dense"
							value={selectedRecord?.status || ""}
							onChange={(e) =>
								setSelectedRecord({ ...selectedRecord, status: e.target.value })
							}
						>
							<MenuItem value="Approved">Approved</MenuItem>
							<MenuItem value="Pending">Pending</MenuItem>
							<MenuItem value="Amended">Amended</MenuItem>
							<MenuItem value="Under Review">Under Review</MenuItem>
							<MenuItem value="Implemented">Implemented</MenuItem>
						</Select>
					</FormControl>

					<TextField
						label="Details"
						fullWidth
						margin="dense"
						value={selectedRecord?.details || ""}
						onChange={(e) =>
							setSelectedRecord({ ...selectedRecord, details: e.target.value })
						}
					/>
					<TextField
						label="Series No."
						fullWidth
						margin="dense"
						value={selectedRecord?.number || ""}
						onChange={(e) =>
							setSelectedRecord({ ...selectedRecord, number: e.target.value })
						}
					/>
					<TextField
						label="Document Type"
						fullWidth
						margin="dense"
						value={selectedRecord?.document_type || ""}
						onChange={(e) =>
							setSelectedRecord({
								...selectedRecord,
								document_type: e.target.value,
							})
						}
					/>
					<TextField
						label="Date Issued"
						type="date"
						fullWidth
						margin="dense"
						value={
							selectedRecord?.date_issued
								? new Date(selectedRecord.date_issued)
										.toISOString()
										.split("T")[0]
								: ""
						}
						onChange={(e) =>
							setSelectedRecord({
								...selectedRecord,
								date_issued: e.target.value, // Ensure the date remains without time
							})
						}
						InputLabelProps={{ shrink: true }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenEdit(false)}>Cancel</Button>
					<Button
						onClick={() => handleSave()}
						variant="contained"
						color="primary"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
export default EOTable;
