import { useState, useEffect, useMemo } from "react";
import {
	Typography,
	CircularProgress,
	TextField,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableContainer,
	TablePagination,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	MenuItem,
	Box,
} from "@mui/material";
import {
	fetchOrdinancesCoverage,
	addCoverageScope,
	updateCoverageScope,
} from "../api";

export default function CoverageTable() {
	const [ordinances, setOrdinances] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [selectedCoverage, setSelectedCoverage] = useState(null);

	useEffect(() => {
		getCoverage();
	}, []);

	const getCoverage = async () => {
		try {
			const response = await fetchOrdinancesCoverage();
			setOrdinances(response || []);
		} catch (err) {
			setError("No Ordinance Found.");
		} finally {
			setLoading(false);
		}
	};

	const filteredOrdinances = useMemo(() => {
		return ordinances.filter(
			(ordinance) =>
				ordinance.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				ordinance.coverage_scopes.some((scope) =>
					[
						"target_beneficiaries",
						"geographical_coverage",
						"inclusive_period",
					].some((key) =>
						scope[key]?.toLowerCase().includes(searchQuery.toLowerCase())
					)
				)
		);
	}, [ordinances, searchQuery]);

	const handleEdit = (ordinance, scope) => {
		setSelectedCoverage({
			id: scope?.id || "",
			ordinance_id: ordinance.id,
			inclusive_period: scope?.inclusive_period || "",
			target_beneficiaries: scope?.target_beneficiaries || "General Public",
			geographical_coverage: scope?.geographical_coverage || "",
		});
		setOpenModal(true);
	};

	const handleChange = (e) => {
		setSelectedCoverage({
			...selectedCoverage,
			[e.target.name]: e.target.value,
		});
	};

	const handleSave = async () => {
		try {
			if (selectedCoverage.id) {
				await updateCoverageScope(selectedCoverage.id, selectedCoverage);
				alert("Coverage scope updated successfully!");
			} else {
				await addCoverageScope(selectedCoverage);
				alert("Coverage scope added successfully!");
			}

			setOpenModal(false);
			setLoading(true);
			getCoverage(); // Refresh the data
		} catch (error) {
			setError("Failed to save coverage scope. Please try again.");
			console.error("Error saving coverage scope:", error);
		}
	};

	const handleSearchChange = (event) => setSearchQuery(event.target.value);
	const handlePageChange = (event, newPage) => setPage(newPage);
	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	if (loading) return <CircularProgress />;
	if (error) return <Typography color="error">{error}</Typography>;

	return (
		<div>
			<TextField
				label="Search Record"
				variant="outlined"
				margin="normal"
				value={searchQuery}
				onChange={handleSearchChange}
			/>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Inclusive Period</TableCell>
							<TableCell>Target Beneficiaries</TableCell>
							<TableCell>Geographical Coverage</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.flatMap((ordinance) =>
								ordinance.coverage_scopes.length > 0 ? (
									ordinance.coverage_scopes.map((scope) => (
										<TableRow key={`${ordinance.id}-${scope.id}`}>
											<TableCell>
												{ordinance.title} {ordinance.number}
											</TableCell>
											<TableCell>{scope.inclusive_period}</TableCell>
											<TableCell>{scope.target_beneficiaries}</TableCell>
											<TableCell>{scope.geographical_coverage}</TableCell>
											<TableCell>
												<Button
													variant="outlined"
													onClick={() => handleEdit(ordinance, scope)}
												>
													Edit
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow key={ordinance.id}>
										<TableCell>
											{ordinance.title} {ordinance.number}
										</TableCell>
										<TableCell colSpan={3}>
											No coverage scope available
										</TableCell>
										<TableCell>
											<Button
												variant="contained"
												onClick={() => handleEdit(ordinance, null)}
											>
												Add
											</Button>
										</TableCell>
									</TableRow>
								)
							)}
					</TableBody>
				</Table>
			</TableContainer>
			<Box display="flex" justifyContent="flex-end" mt={2}>
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
			<Dialog open={openModal} onClose={() => setOpenModal(false)}>
				<DialogTitle>
					{selectedCoverage?.id ? "Edit" : "Add"} Coverage Scope
				</DialogTitle>
				<DialogContent>
					<TextField
						label="Inclusive Period"
						name="inclusive_period"
						value={selectedCoverage?.inclusive_period || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Target Beneficiaries"
						name="target_beneficiaries"
						value={selectedCoverage?.target_beneficiaries || "General Public"}
						onChange={handleChange}
						select
						fullWidth
						margin="normal"
					>
						{[
							"General Public",
							"Women",
							"Children",
							"Solo Parents",
							"PWDs",
							"MSMEs",
							"Others",
						].map((option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label="Geographical Coverage"
						name="geographical_coverage"
						value={selectedCoverage?.geographical_coverage || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenModal(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleSave}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
