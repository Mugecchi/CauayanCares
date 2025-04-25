import React from "react";
import { Paper, useTheme, Skeleton } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const LineGraph = ({ data = {}, colors = [], title, isLoading }) => {
	const theme = useTheme();
	const defaultColors = [
		theme.palette.primary.main,
		theme.palette.secondary.main,
		theme.palette.error.main,
		theme.palette.warning.main,
		theme.palette.success.main,
	];

	// Extracting status labels (months/years)
	const statusLabels = Object.keys(data);
	// Get all document types (keys) across all months
	const documentTypes = Array.from(
		new Set(
			statusLabels.reduce((types, month) => {
				Object.keys(data[month]).forEach((type) => {
					if (!types.includes(type)) types.push(type);
				});
				return types;
			}, [])
		)
	);

	// Prepare series data for each document type
	const seriesData = documentTypes.map((type, index) => {
		const typeData = statusLabels.map((month) => {
			return data[month][type] || 0; // If no data, set to 0
		});

		return {
			label: type, // Document type as the label
			data: typeData,
			color: colors[index] || defaultColors[index % defaultColors.length], // Assign color
		};
	});

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
				grid={{ vertical: true, horizontal: true }}
				xAxis={[{ scaleType: "band", data: statusLabels }]} // X-axis represents months
				series={seriesData} // Multiple lines based on document types
			/>
		</Paper>
	);
};

export default LineGraph;
