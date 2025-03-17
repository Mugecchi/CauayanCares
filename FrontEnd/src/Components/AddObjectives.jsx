import React, { useState, useEffect } from "react";
import {
	Autocomplete,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
} from "@mui/material";
import { fetchOrdinances, addObjectiveImplementation } from "../api"; // Import from your api.jsx

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
		const loadOrdinances = async () => {
			try {
				const response = await fetchOrdinances(); // Use fetchOrdinances from api.jsx
				setOrdinances(response);
			} catch (error) {
				console.error("Error fetching ordinances:", error);
			}
		};
		loadOrdinances();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await addObjectiveImplementation(formData); // Use addObjectiveImplementation from api.jsx
			alert("Objective/Implementation added successfully!");
		} catch (error) {
			console.error("Error adding Objective or Implementation:", error);
		}
	};

	return (
		<>
			<Typography variant="h5">Add Objectives/Implementation</Typography>
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
