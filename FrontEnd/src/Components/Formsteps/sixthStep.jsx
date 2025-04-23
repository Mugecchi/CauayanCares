import React from "react";
import {
	Grid,
	TextField,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
} from "@mui/material";

const Step6 = ({ formValues, updateForm }) => {
	const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel>Funding Source</InputLabel>
					<Select
						name="funding_source"
						value={formValues.funding_source || ""}
						label="Funding Source"
						onChange={handleChange}
					>
						<MenuItem value="General Fund">General Fund</MenuItem>
						<MenuItem value="Grants">Grants</MenuItem>
						<MenuItem value="Others">Others</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					minRows={3}
					label="Outcomes & Results"
					name="outcomes_results"
					value={formValues.outcomes_results || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					minRows={3}
					label="Impact on Gender Responsiveness"
					name="gender_responsiveness_impact"
					value={formValues.gender_responsiveness_impact || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					minRows={3}
					label="Community Benefits"
					name="community_benefits"
					value={formValues.community_benefits || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					minRows={3}
					label="Adjustments Needed"
					name="adjustments_needed"
					value={formValues.adjustments_needed || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					minRows={3}
					label="Outcomes Result"
					name="outcomes_result"
					value={formValues.outcomes_results || ""}
					onChange={handleChange}
				/>
			</Grid>
		</Grid>
	);
};

export default Step6;
