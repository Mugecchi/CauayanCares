// Step5.jsx – Monitoring
import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const Step5 = ({ formValues, updateForm }) => {
	const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextField
					select
					fullWidth
					label="Monitoring Frequency"
					name="monitoring_frequency"
					value={formValues.monitoring_frequency || ""}
					onChange={handleChange}
				>
					{["Monthly", "Quarterly", "Annually"].map((freq) => (
						<MenuItem key={freq} value={freq}>
							{freq}
						</MenuItem>
					))}
				</TextField>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					type="number"
					label="Compliance Rate (%)"
					name="compliance_rate"
					value={formValues.compliance_rate || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Challenges Encountered"
					name="challenges_encountered"
					value={formValues.challenges_encountered || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Violations Report"
					name="violations_report"
					value={formValues.violations_report || ""}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Community Feedback"
					name="community_feedback"
					value={formValues.community_feedback || ""}
					onChange={handleChange}
				/>
			</Grid>
		</Grid>
	);
};

export default Step5;
