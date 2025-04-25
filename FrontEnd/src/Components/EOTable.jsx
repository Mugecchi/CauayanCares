import React, { useEffect, useState } from "react";
import { deleteOrdinance, fetchOrdinances, handlePreview } from "../api";

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
	const [totalPages, setTotalPages] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [documentType, setDocumentType] = useState("");

	const [error, setError] = useState({
		open: false,
		message: "",
		severity: "info",
	});
	useEffect(() => {
		const getRecords = async () => {
			try {
				// Pass searchQuery along with pagination info to the backend
				const res = await fetchOrdinances(page + 1, rowsPerPage, searchQuery);
				if (res.ordinances.length === 0) {
					setError({ message: "No Records found.", severity: "error" });
					setRecords([]);
					setFilteredRecords([]);
				} else {
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
	}, [page, rowsPerPage, searchQuery]); // Add searchQuery as a dependency

	useEffect(() => {
		const filtered = records.filter((record) => {
			const matchesQuery =
				record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				record.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
				record.document_type
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				record.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
				record.number.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesType =
				!documentType || record.document_type === documentType;

			return matchesQuery && matchesType;
		});

		setFilteredRecords(filtered);
	}, [searchQuery, documentType, records]);

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
		...new Set(records.map((record) => record.document_type)),
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
					<PrintTableSummary ordinances={filteredRecords} />
				</Box>
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
									<Tooltip title="Edit Ordinance" arrow>
										<IconButton
											onClick={() => {
												setSelectedRecord(record);
												setOpenEdit(true);
											}}
											color="primary"
										>
											<img src="/edit.svg" alt="edit" />
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
			<Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullScreen>
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
					<TextField
						label="Status"
						fullWidth
						margin="dense"
						value={selectedRecord?.status || ""}
						onChange={(e) =>
							setSelectedRecord({ ...selectedRecord, status: e.target.value })
						}
					/>
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
								date_issued: e.target.value,
							})
						}
						InputLabelProps={{ shrink: true }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenEdit(false)}>Cancel</Button>
					<Button
						onClick={() => handleEditSave()}
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
