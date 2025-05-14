import { useState, useEffect, useMemo } from "react";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import { fetchMonitoring, addMonitoring, updateMonitoring } from "../api";
import { Tooltip } from "@mui/material";

export default function Monitoring() {
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
		const cachedData = localStorage.getItem("MonitoringRecords");
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
				const response = await fetchMonitoring();
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
			"MonitoringRecords",
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

			// Match any coverage scope fields
			const scopeMatch = ordinance.coverage_scopes?.some((scope) =>
				[
					"indicators_of_success",
					"monitoring_frequency",
					"compliance_rate",
					"challenges",
					"violations_reports",
					"feedback_mechanisms",
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
			compliance_rate: scope?.compliance_rate || "0.00",
			indicators_of_success: scope?.indicators_of_success || "",
			monitoring_frequency: scope?.monitoring_frequency || "Monthly",
			challenges: scope?.challenges || "",
			violations_reports: scope?.violations_reports || "",
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
				await updateMonitoring(selectedCoverage.id, selectedCoverage);
				alert("Record updated successfully!");
			} else {
				await addMonitoring(selectedCoverage);
				alert("Record added successfully!");
			}

			setOpenModal(false);
			setLoading(true);

			const updatedData = await fetchMonitoring();

			// Update both localStorage and state correctly
			const cacheData = {
				ordinances: updatedData,
				cachedAt: Date.now(),
			};
			localStorage.setItem("MonitoringRecords", JSON.stringify(cacheData));
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

							<TableCell>Indicators of Success</TableCell>
							<TableCell>Frequency</TableCell>
							<TableCell>Compliance Rate</TableCell>
							<TableCell>Challenges</TableCell>
							<TableCell>Violations</TableCell>
							<TableCell>Feedback</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.flatMap((ordinance) =>
								ordinance.monitoring_compliance.length > 0 ? (
									ordinance.monitoring_compliance.map((scope) => (
										<TableRow key={`${ordinance.id}-${scope.id}`}>
											<TableCell>
												<Tooltip
													title={`${ordinance.title} ${ordinance.number}`}
													arrow
												>
													<span>
														{ordinance.title} {ordinance.number}
													</span>
												</Tooltip>
											</TableCell>
											<TableCell>
												<Tooltip
													title={
														scope.indicators_of_success ||
														"No Monitoring data added"
													}
													arrow
												>
													<span>
														{scope.indicators_of_success ||
															"No Monitoring data added"}
													</span>
												</Tooltip>
											</TableCell>
											<TableCell>
												<Tooltip
													title={
														scope.monitoring_frequency ||
														"No Frequency data added"
													}
													arrow
												>
													<span>
														{scope.monitoring_frequency ||
															"No Frequency data added"}
													</span>
												</Tooltip>
											</TableCell>
											<TableCell>
												<Tooltip
													title={
														scope.compliance_rate
															? `${scope.compliance_rate}% Compliance`
															: "No Compliance data"
													}
													arrow
												>
													<span>{`${scope.compliance_rate}%`}</span>
												</Tooltip>
											</TableCell>
											<TableCell>
												<Tooltip
													title={scope.challenges || "No Challenges data added"}
													arrow
												>
													<span>
														{scope.challenges || "No Challenges data added"}
													</span>
												</Tooltip>
											</TableCell>
											<TableCell>
												<Tooltip
													title={
														scope.violations_reports ||
														"No Violations data added"
													}
													arrow
												>
													<span>
														{scope.violations_reports ||
															"No Violations data added"}
													</span>
												</Tooltip>
											</TableCell>
											<TableCell>
												<Tooltip
													title={
														scope.feedback_mechanisms ||
														"No Feedback data added"
													}
													arrow
												>
													<span>
														{scope.feedback_mechanisms ||
															"No Feedback data added"}
													</span>
												</Tooltip>
											</TableCell>

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
											<Tooltip
												title={`${ordinance.title} ${ordinance.number}`}
												arrow
												placement="top-start"
											>
												{ordinance.title} {ordinance.number}
											</Tooltip>
										</TableCell>
										<TableCell colSpan={6}>No Monitoring Data</TableCell>
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
			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
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
						label="Indicators of Success"
						name="indicators_of_success"
						value={selectedCoverage?.indicators_of_success || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Monitoring Frequency"
						name="monitoring_frequency"
						select
						value={selectedCoverage?.monitoring_frequency || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					>
						<MenuItem value="Monthly">Monthly</MenuItem>
						<MenuItem value="Quarterly">Quarterly</MenuItem>
						<MenuItem value="Yearly">Yearly</MenuItem>
					</TextField>

					<TextField
						label="Compliance Rate"
						name="compliance_rate"
						type="number"
						value={selectedCoverage?.compliance_rate || ""}
						onChange={(e) => {
							const value = e.target.value;
							// Allow only numbers and decimals
							if (/^\d*\.?\d*$/.test(value)) {
								handleChange(e);
							}
						}}
						inputProps={{ step: "0.01", min: "0" }} // Allows decimal values
						fullWidth
						margin="normal"
					/>

					<TextField
						label="Challenges"
						name="challenges"
						value={selectedCoverage?.challenges || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Violations"
						name="violations_reports"
						value={selectedCoverage?.violations_reports || ""}
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
