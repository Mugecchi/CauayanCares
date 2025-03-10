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

export default function ObjectivesTable() {
	const [ordinances, setOrdinances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch all ordinances and their coverage when the component mounts
	useEffect(() => {
		const fetchOrdinances = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/objectives_implementation"
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
		ordinance.objectives_implementation?.some(
			(scope) =>
				ordinance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				scope.policy_objectives
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				scope.lead_agency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				scope.supporting_agencies
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				scope.key_provisions
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				scope.programs_activities
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
			{filteredOrdinances.some(
				(ordinance) => ordinance.objectives_implementation?.length > 0
			) ? (
				<>
					<Typography variant="h4" gutterBottom>
						Objectives or Implementation
					</Typography>
				</>
			) : null}

			{/* Coverage Scope Table */}
			{filteredOrdinances.map((ordinance) =>
				ordinance.objectives_implementation?.length > 0 ? (
					<TableContainer
						key={ordinance.id}
						component={Paper}
						style={{ marginTop: "20px" }}
					>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Title</TableCell>
									<TableCell>Key Provisions</TableCell>
									<TableCell>Lead Agency</TableCell>
									<TableCell>Policy Objectives</TableCell>
									<TableCell>Programs/Activities</TableCell>
									<TableCell>Supporting Agencies</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{ordinance.objectives_implementation.map((scope) => (
									<TableRow key={scope.id}>
										<TableCell key={ordinance.id}>{ordinance.title}</TableCell>
										<TableCell>{scope.key_provisions}</TableCell>
										<TableCell>{scope.lead_agency}</TableCell>
										<TableCell>{scope.policy_objectives}</TableCell>
										<TableCell>{scope.programs_activities} </TableCell>
										<TableCell>{scope.supporting_agencies}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : null
			)}
		</div>
	);
}
