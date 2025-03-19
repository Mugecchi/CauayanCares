import React, { useState, useEffect } from "react";
import { fetchOrdinances, addCoverageScope, updateCoverageScope } from "../api"; // ✅ Import API functions
import {
	Autocomplete,
	Button,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";

const AddCoverageScope = ({ existingScope }) => {
	const [ordinances, setOrdinances] = useState([]);
	const [formData, setFormData] = useState({
		ordinance_id: "",
		inclusive_period: "",
		target_beneficiaries: "General Public",
		geographical_coverage: "",
	});

	// Fetch ordinances on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchOrdinances(); // ✅ Use API function
				setOrdinances(data);
			} catch (error) {
				console.error("Error fetching ordinances:", error);
			}
		};
		fetchData();
	}, []);

	// If updating, prefill the form
	useEffect(() => {
		if (existingScope) {
			setFormData({
				ordinance_id: existingScope.ordinance_id || "",
				inclusive_period: existingScope.inclusive_period || "",
				target_beneficiaries:
					existingScope.target_beneficiaries || "General Public",
				geographical_coverage: existingScope.geographical_coverage || "",
			});
		}
	}, [existingScope]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (existingScope) {
				await updateCoverageScope(existingScope.id, formData); // ✅ Update existing record
				alert("Coverage scope updated successfully!");
			} else {
				await addCoverageScope(formData); // ✅ Add new coverage scope
				alert("Coverage scope added successfully!");
			}
		} catch (error) {
			console.error("Error submitting coverage scope:", error);
		}
	};

	return (
		<>
			<Typography variant="h5">
				{existingScope ? "Update Coverage Scope" : "Add Coverage Scope"}
			</Typography>
			<form onSubmit={handleSubmit}>
				<Autocomplete
					options={ordinances}
					getOptionLabel={(option) => `${option.title} (${option.number})`}
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
						<TextField {...params} label="Record Title/Number" required />
					)}
				/>

				<TextField
					type="text"
					name="inclusive_period"
					label="Inclusive Period"
					value={formData.inclusive_period}
					onChange={handleChange}
					required
				/>

				<TextField
					name="target_beneficiaries"
					label="Target Beneficiaries"
					value={formData.target_beneficiaries}
					onChange={handleChange}
					select
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

				<TextField
					type="text"
					label="Geographical Coverage"
					name="geographical_coverage"
					value={formData.geographical_coverage}
					onChange={handleChange}
					required
				/>

				<Button variant="contained" type="submit">
					{existingScope ? "Update Coverage Scope" : "Add Coverage Scope"}
				</Button>
			</form>
		</>
	);
};

export default AddCoverageScope;
