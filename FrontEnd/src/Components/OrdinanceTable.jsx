import { useState, useEffect } from "react";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";

export default function OrdinanceTable() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchType, setSearchType] = useState("id");
	const [ordinances, setOrdinances] = useState([]);
	const [filteredOrdinance, setFilteredOrdinance] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Fetch all ordinances when the component mounts
	useEffect(() => {
		const fetchAllOrdinances = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/ordinances"
				);
				setOrdinances(response.data);
			} catch (err) {
				setError("Failed to fetch ordinances.");
			}
		};

		fetchAllOrdinances();
	}, []);

	const fetchOrdinance = async () => {
		if (!searchQuery.trim()) {
			setError("Please enter a search value.");
			setFilteredOrdinance(null);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			setFilteredOrdinance(null);

			const endpoint =
				searchType === "id"
					? `http://localhost:5000/api/ordinances/id/${encodeURIComponent(
							searchQuery
					  )}`
					: `http://localhost:5000/api/ordinances/title/${encodeURIComponent(
							searchQuery
					  )}`;

			const response = await axios.get(endpoint);
			setFilteredOrdinance(response.data);
		} catch (err) {
			setError(err.response?.data?.error || "Failed to fetch ordinance data.");
			setFilteredOrdinance(null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{/* Dropdown to Select Search Type */}
			<FormControl fullWidth>
				<InputLabel>Search By</InputLabel>
				<Select
					value={searchType}
					onChange={(e) => setSearchType(e.target.value)}
					variant="outlined"
				>
					<MenuItem value="id">Ordinance ID</MenuItem>
					<MenuItem value="title">Ordinance Title</MenuItem>
				</Select>
			</FormControl>

			{/* Search Input */}
			<TextField
				label={searchType === "id" ? "Ordinance ID" : "Ordinance Title"}
				variant="outlined"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				fullWidth
				style={{ marginTop: "10px" }}
			/>

			{/* Search Button */}
			<Button
				variant="contained"
				color="primary"
				onClick={fetchOrdinance}
				disabled={loading}
				style={{ marginTop: "10px" }}
			>
				{loading ? "Loading..." : "Search"}
			</Button>

			{error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

			{/* Ordinance Table */}
			<TableContainer component={Paper} style={{ marginTop: "20px" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Document Type</TableCell>
							<TableCell>Number</TableCell>
							<TableCell>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{(filteredOrdinance ? [filteredOrdinance] : ordinances).map(
							(ordinance) => (
								<TableRow key={ordinance.id}>
									<TableCell>{ordinance.id}</TableCell>
									<TableCell>{ordinance.title}</TableCell>
									<TableCell>{ordinance.document_type}</TableCell>
									<TableCell>{ordinance.number}</TableCell>
									<TableCell>{ordinance.status}</TableCell>
								</TableRow>
							)
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Coverage Scope Table */}
			{(filteredOrdinance ? [filteredOrdinance] : ordinances).map(
				(ordinance) =>
					ordinance.coverage_scopes?.length > 0 && (
						<TableContainer
							key={ordinance.id}
							component={Paper}
							style={{ marginTop: "20px" }}
						>
							<h3>Coverage Scope - Ordinance {ordinance.id}</h3>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Inclusive Period</TableCell>
										<TableCell>Target Beneficiaries</TableCell>
										<TableCell>Geographical Coverage</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{ordinance.coverage_scopes.map((scope) => (
										<TableRow key={scope.id}>
											<TableCell>{scope.id}</TableCell>
											<TableCell>{scope.inclusive_period}</TableCell>
											<TableCell>{scope.target_beneficiaries}</TableCell>
											<TableCell>{scope.geographical_coverage}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)
			)}
		</div>
	);
}
