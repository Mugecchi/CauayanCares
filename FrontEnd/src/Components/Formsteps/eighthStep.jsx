import React from "react";
import { Grid, Typography, Divider, Box } from "@mui/material";

const Step8 = ({ formValues }) => {
	return (
		<Box sx={{ overflow: "auto", maxHeight: "500px" }}>
			<Grid container spacing={2}>
				{Object.entries(formValues).map(([key, value]) => (
					<Grid item xs={12} key={key}>
						<Typography variant="subtitle2" color="textSecondary">
							{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
						</Typography>
						<Typography variant="body1">
							{key === "file_path" && value instanceof File
								? value.name || "No file name available"
								: typeof value === "object" && value !== null
								? value.name || value.path || "No file name available"
								: value || "-"}
						</Typography>
						<Divider sx={{ my: 1 }} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default Step8;
