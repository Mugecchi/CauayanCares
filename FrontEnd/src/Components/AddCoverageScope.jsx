import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Autocomplete,
	Button,
	Card,
	CardContent,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";

const AddCoverageScope = () => {
	const [ordinances, setOrdinances] = useState([]);
	const [formData, setFormData] = useState({
		ordinance_id: "",
		inclusive_period: "",
		target_beneficiaries: "General Public",
		geographical_coverage: "",
	});

	useEffect(() => {
		fetchOrdinances();
	}, []);

	const fetchOrdinances = async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/ordinances", {
				withCredentials: true,
			});
			setOrdinances(response.data);
		} catch (error) {
			console.error("Error fetching ordinances:", error);
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:5000/api/coverage_scope", formData, {
				withCredentials: true,
			});
			alert("Coverage scope added successfully!");
		} catch (error) {
			console.error("Error adding coverage scope:", error);
		}
	};

	return (
		<Card>
			<CardContent>
				<Typography variant="h5">Coverage Scope</Typography>
				<form onSubmit={handleSubmit}>
					<Typography>Ordinance:</Typography>
					<Autocomplete
						options={ordinances}
						getOptionLabel={(option) => option.title} // Display ordinance titles
						value={
							ordinances.find((ord) => ord.id === formData.ordinance_id) || null
						}
						onChange={(event, newValue) => {
							setFormData((prev) => ({
								...prev,
								ordinance_id: newValue ? newValue.id : "",
							}));
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select Ordinance"
								fullWidth
								required
							/>
						)}
					/>

					<Typography>Inclusive Period:</Typography>
					<TextField
						type="text"
						name="inclusive_period"
						value={formData.inclusive_period}
						onChange={handleChange}
						fullWidth
						required
					/>

					<Typography>Target Beneficiaries/Categories:</Typography>
					<TextField
						name="target_beneficiaries"
						value={formData.target_beneficiaries}
						onChange={handleChange}
						select
						fullWidth
						required
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

					<Typography>Geographical Coverage:</Typography>
					<TextField
						type="text"
						name="geographical_coverage"
						value={formData.geographical_coverage}
						onChange={handleChange}
						fullWidth
						required
					/>

					<Button type="submit">Add Coverage Scope</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default AddCoverageScope;
