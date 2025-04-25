import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const Step4 = ({ formValues, updateForm }) => {
	const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label="Lead Agency"
					name="lead_agency" // Updated to match the database column name
					value={formValues.lead_agency || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Supporting Agencies" // Updated to match the database column name
					name="supporting_agencies" // Updated to match the database column name
					value={formValues.supporting_agencies || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Key Provisions"
					name="key_provisions"
					value={formValues.key_provisions || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Programs & Activities"
					name="programs_activities"
					value={formValues.programs_activities || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Indicators of Success"
					name="indicators_of_success"
					value={formValues.indicators_of_success || ""}
					onChange={handleChange}
				/>
			</Grid>
		</Grid>
	);
};

export default Step4;
