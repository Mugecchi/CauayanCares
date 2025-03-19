import { useState, useEffect } from "react";
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
	Box,
	TablePagination,
} from "@mui/material";
import { fetchIassesment } from "../api"; // Importing the API function

export default function IASsesment() {
	const [ordinances, setOrdinances] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [loading, setLoading] = useState(true);
	const [err, setError] = useState("");

	useEffect(() => {
		const getCoverage = async () => {
			try {
				const response = await fetchIassesment();
				setOrdinances(response || []); // Ensure it is an array
			} catch (err) {
				setError("No Ordinance Found.");
			} finally {
				setLoading(false);
			}
		};

		getCoverage();
	}, []);

	// Filter ordinances based on the search query
	const filteredOrdinances = ordinances.filter(
		(ordinance) =>
			ordinance.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(ordinance.monitoring_compliance ?? []).some(
				(scope) =>
					scope.indicators_of_success
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					scope.compliance_rate
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					scope.challenges?.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Loading state
	if (loading) return <CircularProgress />;

	// Error state
	if (err) return <Typography color="error">{err}</Typography>;

	return (
		<div>
			<TextField
				label="Search Record"
				variant="outlined"
				margin="normal"
				value={searchQuery}
				onChange={handleSearchChange}
			/>
			<TableContainer sx={{ maxHeight: 600 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>Title & Number</TableCell>
							<TableCell>Indicators of Success</TableCell>
							<TableCell>Monitoring Frequency</TableCell>
							<TableCell>Compliance Rate</TableCell>
							<TableCell>Challenges</TableCell>
							<TableCell>Violations Reports</TableCell>
							<TableCell>Feedback Mechanisms</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									No results found.
								</TableCell>
							</TableRow>
						) : (
							filteredOrdinances
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.flatMap((ordinance) =>
									(ordinance.monitoring_compliance || []).map((scope) => (
										<TableRow key={`${ordinance.id}-${scope.id}`}>
											<TableCell>
												{ordinance.title} {ordinance.number}
											</TableCell>
											<TableCell>
												{scope.indicators_of_success || "N/A"}
											</TableCell>
											<TableCell>
												{scope.monitoring_frequency || "N/A"}
											</TableCell>
											<TableCell>{scope.compliance_rate || "N/A"}</TableCell>
											<TableCell>{scope.challenges || "N/A"}</TableCell>
											<TableCell>{scope.violations_reports || "N/A"}</TableCell>
											<TableCell>
												{scope.feedback_mechanisms || "N/A"}
											</TableCell>
										</TableRow>
									))
								)
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Pagination */}
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
		</div>
	);
}
