import React, { useState, useEffect } from "react";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import { fetchOrdinances, addObjectiveImplementation } from "../api";

const AddObjectives = () => {
	const [ordinances, setOrdinances] = useState([]);
	const [formData, setFormData] = useState({
		ordinance_id: "",
		policy_objectives: "",
		lead_agency: "",
		supporting_agencies: "",
		key_provisions: "",
		programs_activities: "",
	});

	useEffect(() => {
		const getOrdinances = async () => {
			try {
				const data = await fetchOrdinances();
				setOrdinances(data);
			} catch (error) {
				console.error("Failed to load ordinances.");
			}
		};
		getOrdinances();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await addObjectiveImplementation(formData);
			alert("Objective/Implementation added successfully!");
		} catch (error) {
			alert("Failed to add Objective/Implementation.");
		}
	};

	return (
		<>
			<Typography variant="h5">Add Objectives/Implementation</Typography>
			<form onSubmit={handleSubmit}>
				<Typography>Ordinance:</Typography>
				<Autocomplete
					options={ordinances}
					getOptionLabel={(option) => option.title}
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

				<Typography>Policy/Objectives:</Typography>
				<TextField
					type="text"
					name="policy_objectives"
					value={formData.policy_objectives}
					onChange={handleChange}
					fullWidth
					required
				/>

				<Typography>Lead Agency:</Typography>
				<TextField
					type="text"
					name="lead_agency"
					value={formData.lead_agency}
					onChange={handleChange}
					fullWidth
					required
				/>

				<Typography>Supporting Agency:</Typography>
				<TextField
					type="text"
					name="supporting_agencies"
					value={formData.supporting_agencies}
					onChange={handleChange}
					fullWidth
					required
				/>

				<Typography>Key Provisions:</Typography>
				<TextField
					type="text"
					name="key_provisions"
					value={formData.key_provisions}
					onChange={handleChange}
					fullWidth
					required
				/>

				<Typography>Programs/Activities:</Typography>
				<TextField
					type="text"
					name="programs_activities"
					value={formData.programs_activities}
					onChange={handleChange}
					fullWidth
					required
				/>

				<Button type="submit">Add Objectives/Implementation</Button>
			</form>
		</>
	);
};

export default AddObjectives;
