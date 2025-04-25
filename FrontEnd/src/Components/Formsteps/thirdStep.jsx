// Step3.jsx – Objectives & Coverage
import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const Step3 = ({ formValues, updateForm }) => {
	const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

	return (
		<Grid container spacing={2}>
			{/* Allocated Budget */}
			<Grid item xs={12}>
				<TextField
					fullWidth
					label="Allocated Budget"
					name="allocated_budget"
					type="number"
					value={formValues.allocated_budget || ""}
					onChange={handleChange}
					inputProps={{ min: 0 }}
				/>
			</Grid>

			{/* Utilized Budget */}
			<Grid item xs={12}>
				<TextField
					fullWidth
					label="Utilized Budget"
					name="utilized_budget"
					type="number"
					value={formValues.utilized_budget || ""}
					onChange={handleChange}
					inputProps={{ min: 0 }}
				/>
			</Grid>

			{/* GAD Budget */}
			<Grid item xs={12}>
				<TextField
					fullWidth
					label="GAD Budget"
					name="gad_budget"
					type="number"
					value={formValues.gad_budget || ""}
					onChange={handleChange}
					inputProps={{ min: 0 }}
				/>
			</Grid>

			{/* Financial Transparency Measures */}
			<Grid item xs={12}>
				<TextField
					fullWidth
					label="Financial Transparency Measures"
					name="financial_transparency_measures"
					value={formValues.financial_transparency_measures || ""}
					onChange={handleChange}
					multiline
				/>
			</Grid>
		</Grid>
	);
};

export default Step3;
