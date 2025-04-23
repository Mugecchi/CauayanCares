import React from "react";
import { Paper, useTheme, Skeleton } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart"; // Import LineChart

const LineGraph = ({ data = {}, colors = [], title, isLoading }) => {
	const theme = useTheme();
	const defaultColors = [
		theme.palette.primary.main,
		theme.palette.secondary.main,
		theme.palette.error.main,
		theme.palette.warning.main,
		theme.palette.success.main,
	];

	const statusLabels = Object.keys(data); // These are just placeholders, replace with actual data if needed

	// Example series data (replace with real data from your `data` or `statuses`)
	const seriesData = [
		{
			label: title || "Example Label", // Replace with dynamic label if needed
			data: Object.values(data), // Replace with dynamic data if needed
			color: colors[0] || defaultColors[0], // Apply color dynamically or use default
		},
	];

	if (isLoading) {
		return (
			<Paper
				sx={{
					borderRadius: 2,
					width: "100%",
					height: "400px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: 2,
				}}
			>
				<Skeleton variant="rectangular" width="100%" height="100%" />
			</Paper>
		);
	}

	return (
		<Paper
			sx={{
				borderRadius: 2,
				width: "100%",
				height: "400px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				p: 2,
			}}
		>
			<LineChart
				xAxis={[{ scaleType: "band", data: statusLabels }]} // This will represent the x-axis values
				series={seriesData} // Provide the series data
			/>
		</Paper>
	);
};

export default LineGraph;
