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
	Snackbar,
	Box,
	Alert,
} from "@mui/material";
import {
	fetchObjectivesImplementation,
	addObjectivesImplementation,
	updateObjectivesImplementation,
} from "../api";

export default function ObjectivesTable() {
	const [ordinances, setOrdinances] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState({
		open: false,
		message: "",
		severity: "info",
	});
	const [openModal, setOpenModal] = useState(false);
	const [selectedCoverage, setSelectedCoverage] = useState(null);

	useEffect(() => {
		getCoverage();
	}, []);

	const getCoverage = async () => {
		try {
			const response = await fetchObjectivesImplementation();
			setOrdinances(response || []);
		} catch (err) {
			setError({
				open: true,
				message: "No Record Found.",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const filteredOrdinances = useMemo(() => {
		return ordinances.filter((ordinance) => {
			const searchLower = searchQuery.toLowerCase();

			// Match title or ordinance number
			const titleOrNumberMatch =
				ordinance.title?.toLowerCase().includes(searchLower) ||
				ordinance.number?.toString().toLowerCase().includes(searchLower);

			// Match any coverage scope fields
			const scopeMatch = ordinance.objectives_implementation?.some((scope) =>
				[
					"lead_agency",
					"supporting_agencies",
					"policy_objectives",
					"key_provisions",
					"programs_activities",
				].some(
					(key) => scope[key] && scope[key].toLowerCase().includes(searchLower)
				)
			);

			return titleOrNumberMatch || scopeMatch;
		});
	}, [ordinances, searchQuery]);

	const handleEdit = (ordinance, scope) => {
		setSelectedCoverage({
			id: scope?.id || "",
			ordinance_id: ordinance.id,
			policy_objectives: scope?.policy_objectives || "",
			lead_agency: scope?.lead_agency || "",
			supporting_agencies: scope?.supporting_agencies || "",
			key_provisions: scope?.key_provisions || "",
			programs_activities: scope?.programs_activities || "",
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
				await updateObjectivesImplementation(
					selectedCoverage.id,
					selectedCoverage
				);
				alert("Coverage scope updated successfully!");
			} else {
				await addObjectivesImplementation(selectedCoverage);
				alert("Coverage scope added successfully!");
			}

			setOpenModal(false);
			setLoading(true);
			getCoverage(); // Refresh the data
		} catch (error) {
			setError({
				open: true,
				message: "Failed to save coverage scope. Please try again.",
				severity: "error",
			});

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
							<TableCell>Policy Objectives</TableCell>
							<TableCell>Lead Agency</TableCell>
							<TableCell>Supporting Agencies</TableCell>
							<TableCell>Key Provisions</TableCell>
							<TableCell>Programs/Activities</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.flatMap((ordinance) =>
								ordinance.objectives_implementation.length > 0 ? (
									ordinance.objectives_implementation.map((scope) => (
										<TableRow key={`${ordinance.id}-${scope.id}`}>
											<TableCell>
												{ordinance.title} {ordinance.number}
											</TableCell>
											{console.log(scope)}
											<TableCell>
												{scope.policy_objectives || "No Objectives Data"}
											</TableCell>
											<TableCell>{scope.lead_agency}</TableCell>
											<TableCell>{scope.supporting_agencies}</TableCell>
											<TableCell>{scope.key_provisions}</TableCell>
											<TableCell>{scope.programs_activities}</TableCell>
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
										<TableCell colSpan={5}>
											No Objectives/Implementation
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
			<Dialog open={openModal} onClose={() => setOpenModal(false)}>
				<DialogTitle>
					{selectedCoverage?.id ? "Edit" : "Add"} Coverage Scope
				</DialogTitle>
				<DialogContent>
					<TextField
						label="Policy Objectives"
						name="policy_objectives"
						value={selectedCoverage?.policy_objectives || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Lead Agency "
						name="lead_agency"
						value={selectedCoverage?.lead_agency || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>

					<TextField
						label="Supporting Agencies"
						name="supporting_agencies"
						value={selectedCoverage?.supporting_agencies || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Key Provisions"
						name="key_provisions"
						value={selectedCoverage?.key_provisions || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Programs Activities"
						name="programs_activities"
						value={selectedCoverage?.programs_activities || ""}
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
			<Snackbar
				open={error.open}
				autoHideDuration={4000}
				onClose={() => setError({ open: false, message: "", severity: "info" })}
			>
				<Alert
					onClose={() =>
						setError({ open: false, message: "", severity: "info" })
					}
					severity={error.severity}
					sx={{ width: "100%" }}
				>
					{error.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
