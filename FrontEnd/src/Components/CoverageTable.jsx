import { useState, useEffect } from "react";
import axios from "axios";
import {
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
} from "@mui/material";

export default function OrdinanceTable() {
	const [ordinances, setOrdinances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch all ordinances and their coverage when the component mounts
	useEffect(() => {
		const fetchOrdinances = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/ordinancesCoverage",
					{
						withCredentials: true,
					}
				);
				setOrdinances(response.data);
			} catch (err) {
				setError("No Ordinance Found.");
			} finally {
				setLoading(false);
			}
		};

		fetchOrdinances();
	}, []);

	if (loading) return <CircularProgress />;
	if (error) return <Typography color="error">{error}</Typography>;

	// Filter ordinances based on search term
	const filteredOrdinances = ordinances.filter((ordinance) =>
		ordinance.coverage_scopes?.some(
			(scope) =>
				ordinance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				scope.inclusive_period
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				scope.target_beneficiaries
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				scope.geographical_coverage
					?.toLowerCase()
					.includes(searchTerm.toLowerCase())
		)
	);

	return (
		<div>
			<TextField
				label="Search Ordinance"
				variant="outlined"
				fullWidth
				margin="normal"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{ backgroundColor: "white" }}
			/>

			<TableContainer component={Paper} style={{ marginTop: "20px" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Inclusive Period</TableCell>
							<TableCell>Target Beneficiaries/Categories</TableCell>
							<TableCell>Geographical Coverage</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrdinances.map((ordinance) =>
							ordinance.coverage_scopes.map((scope) => (
								<TableRow key={scope.id}>
									<TableCell>{ordinance.title}</TableCell>
									<TableCell>{scope.inclusive_period}</TableCell>
									<TableCell>{scope.target_beneficiaries}</TableCell>
									<TableCell>{scope.geographical_coverage}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}
