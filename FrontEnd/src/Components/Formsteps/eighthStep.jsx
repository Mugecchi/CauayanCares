import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

const Step8 = ({ formValues }) => {
	const formatLabel = (key) => {
		// Replace underscores with spaces, add space before capital letters, and capitalize first letters
		return key
			.replace(/_/g, " ")
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/\b\w/g, (c) => c.toUpperCase());
	};

	return (
		<Box sx={{ overflow: "auto", maxHeight: "500px" }}>
			<Grid container spacing={2}>
				{Object.entries(formValues).map(([key, value]) => (
					<Grid item xs={12} key={key}>
						<Typography variant="subtitle2" color="#fff">
							{formatLabel(key)}:
						</Typography>
						<Typography variant="body1" color="#fff">
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
