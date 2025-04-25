import { useState, useEffect, useMemo } from "react";
import {
	MenuItem,
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
import { fetchAssesment, addAssesment, updateAssesment } from "../api";

export default function iAssesment() {
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
		const cachedData = localStorage.getItem("AssessmentRecords");
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			const isExpired = Date.now() - parsed.cachedAt > 1000 * 60 * 5; // 5-minute expiration check

			// If cached data is not expired, load from localStorage
			if (parsed.ordinances?.length > 0 && !isExpired) {
				setOrdinances(parsed.ordinances);
				setLoading(false);
				return;
			}
		}

		// Fetch new records if cache is expired or doesn't exist
		const getCoverage = async () => {
			try {
				const response = await fetchAssesment();
				if (response.length === 0) {
					setError({
						open: true,
						message: "No Record Found.",
						severity: "error",
					});
				} else {
					setError({
						open: true,
						message: "Records fetched Successfully.",
						severity: "success",
					});
					setOrdinances(response);
				}
			} catch (err) {
				setError({
					open: true,
					message: "Error fetching Records.",
					severity: "error",
				});
			} finally {
				setLoading(false);
			}
		};

		getCoverage();
	}, [page, rowsPerPage]);

	// Save state to localStorage whenever there are changes
	useEffect(() => {
		localStorage.setItem(
			"AssessmentRecords",
			JSON.stringify({
				ordinances,
				cachedAt: Date.now(),
			})
		);
	}, [ordinances]); // Store ordinances whenever they change

	const filteredOrdinances = useMemo(() => {
		return ordinances.filter((ordinance) => {
			const searchLower = searchQuery.toLowerCase();

			// Match title or ordinance number
			const titleOrNumberMatch =
				ordinance.title?.toLowerCase().includes(searchLower) ||
				ordinance.number?.toString().toLowerCase().includes(searchLower);

			// Match any Record fields
			const scopeMatch = ordinance.impact_assessment?.some((scope) =>
				[].some(
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
			funding_source: scope?.funding_source || "General Fund",
			outcomes_results: scope?.outcomes_results || "",
			gender_responsiveness_impact: scope?.gender_responsiveness_impact || "",
			community_benefits: scope?.community_benefits || "",
			adjustments_needed: scope?.adjustments_needed || "",
			feedback_mechanisms: scope?.feedback_mechanisms || "",
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
				await updateAssesment(selectedCoverage.id, selectedCoverage);
				alert("Record updated successfully!");
			} else {
				await addAssesment(selectedCoverage);
				alert("Record added successfully!");
			}

			setOpenModal(false);
			setLoading(true);

			const updatedData = await fetchAssesment();

			// Update both localStorage and state correctly
			const cacheData = {
				ordinances: updatedData,
				cachedAt: Date.now(),
			};
			localStorage.setItem("AssessmentsRecords", JSON.stringify(cacheData));
			setOrdinances(updatedData);
			setLoading(false);
		} catch (error) {
			setError({
				open: true,
				message: "Failed to save Record. Please try again.",
				severity: "error",
			});
			console.error("Error saving Record:", error);
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
							<TableCell>Outcome Results</TableCell>
							<TableCell>Gender Responsiveness Impact</TableCell>
							<TableCell>Funding Source</TableCell>
							<TableCell>Community Benefits</TableCell>
							<TableCell>Adjustments Needed</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.flatMap((ordinance) =>
								ordinance.impact_assessment.length > 0 ? (
									ordinance.impact_assessment.map((scope) => (
										<TableRow key={`${ordinance.id}-${scope.id}`}>
											<TableCell>
												{ordinance.title} {ordinance.number}
											</TableCell>
											<TableCell>
												{scope.outcomes_results || "No Assessment data added"}
											</TableCell>
											<TableCell>
												{scope.gender_responsiveness_impact}
											</TableCell>
											<TableCell>
												{scope.funding_source && `${scope.funding_source}`}
											</TableCell>
											<TableCell>{scope.community_benefits}</TableCell>
											<TableCell>{scope.adjustments_needed}</TableCell>
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
										<TableCell colSpan={5}>No Assessment Data</TableCell>
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
					{selectedCoverage?.id ? "Edit" : "Add"} Monitoring Data
				</DialogTitle>
				<DialogContent>
					<TextField
						label="Outcome Results"
						name="outcomes_results"
						value={selectedCoverage?.outcomes_results || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Funding Source"
						name="funding_source"
						select
						onChange={handleChange}
						value={selectedCoverage?.funding_source || ""}
						fullWidth
						margin="normal"
					>
						<MenuItem value="General Fund">General Fund</MenuItem>
						<MenuItem value="Grants">Grants</MenuItem>
						<MenuItem value="Others">Others</MenuItem>
					</TextField>

					<TextField
						label="Gender Responsiveness Impact"
						name="gender_responsiveness_impact"
						value={selectedCoverage?.gender_responsiveness_impact || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>

					<TextField
						label="Community Benefits"
						name="community_benefits"
						value={selectedCoverage?.community_benefits || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Adjustments Needed"
						name="adjustments_needed"
						value={selectedCoverage?.adjustments_needed || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Feedback Mechanisms"
						name="feedback_mechanisms"
						value={selectedCoverage?.feedback_mechanisms || ""}
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
