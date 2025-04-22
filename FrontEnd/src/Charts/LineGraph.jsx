import React from "react";
import { Box, Paper, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart"; // Import LineChart
import { Label } from "@mui/icons-material";

const LineGraph = ({ data = {}, colors = [], title }) => {
	const theme = useTheme();
	const defaultColors = [
		theme.palette.primary.main,
		theme.palette.secondary.main,
		theme.palette.error.main,
		theme.palette.warning.main,
		theme.palette.success.main,
	];

	console.log("Document Types:", data); // Debugging line to check document types
	const statusLabels = Object.keys(data); // These are just placeholders, replace with actual data if needed

	// Example series data (replace with real data from your `data` or `statuses`)
	const seriesData = [
		{
			label: title || "Example Label", // Replace with dynamic label if needed
			data: Object.values(data), // Replace with dynamic data if needed
			color: colors[0] || defaultColors[0], // Apply color dynamically or use default
		},
	];

	return (
		<Paper
			sx={{
				borderradius: 2,
				width: "100%",
				height: "400px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				p: 2,
			}}
		>
			<LineChart
				borderradius={5}
				xAxis={[{ scaleType: "band", data: statusLabels }]} // This will represent the x-axis values
				series={seriesData} // Provide the series data
			/>
		</Paper>
	);
};

export default LineGraph;
