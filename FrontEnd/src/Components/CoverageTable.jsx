import { useState, useEffect, useMemo } from "react";

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
import MenuItem from "@mui/material/MenuItem";

import {
	fetchOrdinancesCoverage,
	addCoverageScope,
	updateCoverageScope,
} from "../api";
import { Tooltip } from "@mui/material";

export default function CoverageTable() {
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
		const getCoverage = async () => {
			try {
				const response = await fetchOrdinancesCoverage();
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
	}, []);

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
					"target_beneficiaries",
					"geographical_coverage",
					"inclusive_period",
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
			inclusive_period: scope?.inclusive_period || "",
			target_beneficiaries: scope?.target_beneficiaries || "",
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
				alert("Record updated successfully!");
			} else {
				await addCoverageScope(selectedCoverage);
				alert("Record added successfully!");
			}

			setOpenModal(false);
			setLoading(true);

			const updatedData = await fetchOrdinancesCoverage();
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

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="60vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	const barangays = [
		"City-Wide",
		"Alicaocao",
		"Alinam",
		"Amobocan",
		"Andarayan",
		"Baculod",
		"Baringin Norte",
		"Baringin Sur",
		"Buena Suerte",
		"Bugallon",
		"Buyon",
		"Cabaruan",
		"Cabugao",
		"Carabatan Bacareno",
		"Carabatan Chica",
		"Carabatan Grande",
		"Carabatan Punta",
		"Casalatan",
		"Cassap Fuera",
		"Catalina",
		"Culalabat",
		"Dabburab",
		"De Vera",
		"Dianao",
		"Dissimuray",
		"District I (Poblacion)",
		"District II (Poblacion)",
		"District III (Poblacion)",
		"Duminit",
		"Faustino (Sipay)",
		"Gagabutan",
		"Gappal",
		"Guayabal",
		"Labinab",
		"Linglingay",
		"Mabantad",
		"Maligaya",
		"Manaoag",
		"Marabulig I",
		"Marabulig II",
		"Minante I",
		"Minante II",
		"Nagcampegan",
		"Naganacan",
		"Nagrumbuan",
		"Nungnungan I",
		"Nungnungan II",
		"Pinoma",
		"Rizal",
		"Rizaluna",
		"Rogus",
		"San Antonio",
		"San Fermin (Poblacion)",
		"San Francisco",
		"San Isidro",
		"San Luis",
		"San Pablo (Casap Hacienda)",
		"Santa Luciana (Daburab 2)",
		"Santa Maria",
		"Sillawit",
		"Sinippil",
		"Tagaran",
		"Turayong",
		"Union",
		"Villa Concepcion",
		"Villa Luna",
		"Villaflor",
	];
	console.log(filteredOrdinances);
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
											<Tooltip
												title={`${ordinance.title}  ${ordinance.number}`}
												arrow
												placement="top-start"
											>
												<TableCell>
													{ordinance.title} {ordinance.number}
													{console.log(ordinance)}
												</TableCell>
											</Tooltip>
											<Tooltip
												title={scope.inclusive_period}
												arrow
												placement="top-start"
											>
												<TableCell>
													{scope.inclusive_period || "No coverage scope added"}
												</TableCell>
											</Tooltip>
											<Tooltip
												arrow
												title={scope.target_beneficiaries}
												placement="top-start"
											>
												<TableCell>{scope.target_beneficiaries}</TableCell>
											</Tooltip>
											<Tooltip
												arrow
												placement="top-start"
												title={scope.geographical_coverage}
											>
												<TableCell>{scope.geographical_coverage}</TableCell>
											</Tooltip>
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
										<Tooltip
											title={`${ordinance.title}  ${ordinance.number}`}
											arrow
											placement="top-start"
										>
											<TableCell>
												{ordinance.title} {ordinance.number}
											</TableCell>
										</Tooltip>
										<TableCell colSpan={3}>No record</TableCell>
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
						select
						margin="normal"
					>
						{barangays.map((option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</TextField>
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
