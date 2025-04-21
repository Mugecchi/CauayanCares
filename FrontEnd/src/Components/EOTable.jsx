import React, { useState, useEffect, useMemo } from "react";
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
	Tooltip,
	TextField,
	TablePagination,
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	TableSortLabel,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { fetchOrdinances, deleteOrdinance, handlePreview } from "../api";
import PrintTableSummary from "../Includes/PrintTableSummary";

const EOTable = () => {
	const [ordinances, setOrdinances] = useState([]);
	const [openPreview, setOpenPreview] = useState(false);
	const [selectedFile, setSelectedFile] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [documentType, setDocumentType] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("title");
	const [totalRecords, setTotalRecords] = useState();
	console.log(totalRecords);

	useEffect(() => {
		fetchOrdinancesData(page + 1, rowsPerPage); // Adding 1 to the page for 1-based indexing
	}, [page, rowsPerPage]);

	const fetchOrdinancesData = async (page, rowsPerPage) => {
		try {
			// Fetch paginated data from the backend
			const ordinancesData = await fetchOrdinances(page, rowsPerPage);
			// Update the ordinances state with the paginated data
			setOrdinances(ordinancesData.ordinances);
			// Set the total count of ordinances from the backend response
			setTotalRecords(ordinancesData.total_pages);
		} catch (error) {
			console.error("Error fetching ordinances:", error);
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this record?")) {
			try {
				await deleteOrdinance(id);
				fetchOrdinancesData();
			} catch (error) {
				console.error("Error deleting record:", error);
			}
		}
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleDocumentTypeChange = (event) => {
		setDocumentType(event.target.value);
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleRequestSort = (property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const filteredOrdinances = useMemo(() => {
		return (
			ordinances
				// Exclude ordinances where all fields except 'id' are null or undefined
				.filter((ordinance) =>
					Object.entries(ordinance)
						.filter(([key]) => key !== "id")
						.some(([, value]) => value !== null && value !== undefined)
				)
				// Existing filter for search and document type
				.filter((ordinance) => {
					const matchesSearch = Object.entries(ordinance)
						.filter(([key]) => key !== "file_path")
						.some(
							([_, value]) =>
								value &&
								value
									.toString()
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
						);
					const matchesDocumentType =
						!documentType || ordinance.document_type === documentType;
					return matchesSearch && matchesDocumentType;
				})
				// Sorting logic
				.sort((a, b) => {
					let valA = a[orderBy] ?? "";
					let valB = b[orderBy] ?? "";

					if (orderBy === "date_issued") {
						valA = new Date(valA || 0);
						valB = new Date(valB || 0);
					}

					if (valA < valB) return order === "asc" ? -1 : 1;
					if (valA > valB) return order === "asc" ? 1 : -1;
					return 0;
				})
		);
	}, [ordinances, searchQuery, documentType, orderBy, order]);

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
							<MenuItem value="">All</MenuItem>
							<MenuItem value="Ordinance">Ordinance</MenuItem>
							<MenuItem value="Resolution">Resolution</MenuItem>
							<MenuItem value="Executive Order">Executive Order</MenuItem>
							<MenuItem value="Memo">Memo</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box>
					<PrintTableSummary ordinances={filteredOrdinances} />
				</Box>
			</Box>

			<TableContainer>
				<Table stickyHeader size="medium">
					<TableHead>
						<TableRow>
							<TableCell>
								<TableSortLabel
									active={orderBy === "title"}
									direction={orderBy === "title" ? order : "asc"}
									onClick={() => handleRequestSort("title")}
								>
									Title
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === "document_type"}
									direction={orderBy === "document_type" ? order : "asc"}
									onClick={() => handleRequestSort("document_type")}
								>
									Type of Document
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === "number"}
									direction={orderBy === "number" ? order : "asc"}
									onClick={() => handleRequestSort("number")}
								>
									Number
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === "details"}
									direction={orderBy === "details" ? order : "asc"}
									onClick={() => handleRequestSort("details")}
								>
									Details
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === "date_issued"}
									direction={orderBy === "date_issued" ? order : "asc"}
									onClick={() => handleRequestSort("date_issued")}
								>
									Date Issued
								</TableSortLabel>
							</TableCell>
							<TableCell>Date of Effectivity</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((ordinance) => (
								<TableRow key={ordinance.id} hover>
									<TableCell>
										<Tooltip title={ordinance.title} arrow>
											<span
												style={{
													display: "block",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: "180px",
												}}
											>
												{ordinance.title}
											</span>
										</Tooltip>
									</TableCell>

									<TableCell>
										<Tooltip title={ordinance.document_type} arrow>
											<span
												style={{
													display: "block",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: "180px",
												}}
											>
												{ordinance.document_type}
											</span>
										</Tooltip>
									</TableCell>

									<TableCell>
										<Tooltip title={ordinance.number} arrow>
											<span
												style={{
													display: "block",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: "120px",
												}}
											>
												{ordinance.number}
											</span>
										</Tooltip>
									</TableCell>

									<TableCell>
										<Tooltip title={ordinance.details} arrow>
											<span
												style={{
													display: "block",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: "200px",
												}}
											>
												{ordinance.details}
											</span>
										</Tooltip>
									</TableCell>

									<TableCell>
										<Tooltip
											title={new Intl.DateTimeFormat("en-US", {
												dateStyle: "medium",
											}).format(new Date(ordinance.date_issued))}
											arrow
										>
											<span>
												{new Intl.DateTimeFormat("en-US", {
													dateStyle: "medium",
												}).format(new Date(ordinance.date_issued))}
											</span>
										</Tooltip>
									</TableCell>

									<TableCell>
										<Tooltip
											title={new Intl.DateTimeFormat("en-US", {
												dateStyle: "medium",
											}).format(new Date(ordinance.date_effectivity))}
											arrow
										>
											<span>
												{new Intl.DateTimeFormat("en-US", {
													dateStyle: "medium",
												}).format(new Date(ordinance.date_effectivity))}
											</span>
										</Tooltip>
									</TableCell>

									<TableCell>
										<Tooltip title={ordinance.status} arrow>
											<span>{ordinance.status}</span>
										</Tooltip>
									</TableCell>

									<TableCell>
										{ordinance.file_path && (
											<Tooltip title="Preview File" arrow>
												<IconButton
													onClick={() =>
														handlePreview(
															ordinance.file_path,
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
												onClick={() => handleDelete(ordinance.id)}
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
					rowsPerPageOptions={[10, 20, 100]}
					component="div"
					count={totalRecords} // Total count from backend
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleRowsPerPageChange}
				/>
			</Box>

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
};

export default EOTable;
