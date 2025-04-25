import { useState, useEffect, useMemo } from "react";
import {
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
	fetchFinancialData,
	addFinancialData,
	updateFinancialData,
} from "../api";

export default function BudgetTable() {
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
		const cachedData = localStorage.getItem("BudgetRecords");
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
				const response = await fetchFinancialData();
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
			"BudgetRecords",
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
			const scopeMatch = ordinance.budget_allocation?.some((scope) =>
				[
					"allocated_budget",
					"utilized_budget",
					"gad_budget",
					"financial_transparency_measures",
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
			allocated_budget: scope?.allocated_budget || "",
			utilized_budget: scope?.utilized_budget || "",
			gad_budget: scope?.gad_budget || "",
			financial_transparency_measures:
				scope?.financial_transparency_measures || "",
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
				await updateFinancialData(selectedCoverage.id, selectedCoverage);
				alert("Record updated successfully!");
			} else {
				await addFinancialData(selectedCoverage);
				alert("Record added successfully!");
			}

			setOpenModal(false);
			setLoading(true);

			const updatedData = await fetchFinancialData();

			// Update both localStorage and state correctly
			const cacheData = {
				ordinances: updatedData,
				cachedAt: Date.now(),
			};
			localStorage.setItem("BudgetRecords", JSON.stringify(cacheData));
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
	const formatCurrency = (amount) => {
		if (!amount || isNaN(amount)) return "₱0.00";
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			minimumFractionDigits: 2,
		}).format(amount);
	};

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
							<TableCell>Allocated Budget</TableCell>
							<TableCell>Utilized Budget</TableCell>
							<TableCell>GAD Budget</TableCell>
							<TableCell>Financial Transparency Measures</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.flatMap((ordinance) =>
								ordinance.budget_allocation.length > 0 ? (
									ordinance.budget_allocation.map((scope) => (
										<TableRow key={`${ordinance.id}-${scope.id}`}>
											<TableCell>
												{ordinance.title} {ordinance.number}
											</TableCell>
											<TableCell>
												{formatCurrency(scope.allocated_budget)}
											</TableCell>
											<TableCell>
												{formatCurrency(scope.utilized_budget)}
											</TableCell>
											<TableCell>{formatCurrency(scope.gad_budget)}</TableCell>
											<TableCell>
												{scope.financial_transparency_measures}
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
											{ordinance.title} {ordinance.number}
										</TableCell>
										<TableCell colSpan={4}>No Budget Allocation Data</TableCell>
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
						label="Allocated Budget"
						name="allocated_budget"
						type="number"
						value={selectedCoverage?.allocated_budget || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>

					<TextField
						label="Utilized Budget"
						type="number"
						name="utilized_budget"
						value={selectedCoverage?.utilized_budget || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="GAD Budget"
						type="number"
						name="gad_budget"
						value={selectedCoverage?.gad_budget || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>

					<TextField
						label="Financial Transparency Measures"
						name="financial_transparency_measures"
						value={selectedCoverage?.financial_transparency_measures || ""}
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
