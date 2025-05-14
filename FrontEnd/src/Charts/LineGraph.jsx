import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import useTheme from "@mui/material/styles/useTheme";

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

	const colorMap = {
		resolution: theme.palette.warning.main,
		ordinance: theme.palette.error.main,
		memo: theme.palette.secondary.main,
		"executive order": theme.palette.primary.main,
	};

	const seriesData = documentTypes.map((type, index) => {
		const typeData = statusLabels.map((month) => data[month][type] || 0);

		return {
			label: type,
			data: typeData,
			color:
				colorMap[type.toLowerCase()] ||
				colors[index] ||
				defaultColors[index % defaultColors.length],
		};
	});
	if (isLoading) {
		return (
			<Paper
				sx={{
					flexDirection: "column",
					borderRadius: 2,
					width: "100%",
					height: "500px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: 2,
					overflow: "hidden",
				}}
			>
				<Skeleton
					variant="rectangular"
					width="100%"
					height="100%"
					sx={{
						background: "linear-gradient(90deg, #d4bcef, #e2d5f7, #d4bcef)",
						transform: "scale(1.1)", // Slight zoom effect if desired
					}}
				/>
			</Paper>
		);
	}

	return (
		<Paper
			sx={{
				backdropFilter: "blur(10px)", // 100px is extreme and often ineffective
				WebkitBackdropFilter: "blur(10px)", // Safari support
				backgroundColor: "rgba(255, 255, 255, 0.22)", // Add transparency
				borderRadius: 2,
				width: "100%",
				height: "400px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				p: 2,
			}}
			elevation={5}
		>
			<LineChart
				sx={{
					"& text": {
						fill: "#fff !important",
						color: "#fff", // Sets all text in the chart to white
					},
					"& .MuiChartsAxis-root": {
						"& text": {
							fill: "#fff", // Ensures axis text is white
						},
						"& path, & line": {
							stroke: "#fff", // Ensures axis lines and ticks are white
						},
					},
				}}
				grid={{ vertical: true, horizontal: true }}
				xAxis={[{ scaleType: "band", data: statusLabels }]} // X-axis represents months
				series={seriesData} // Multiple lines based on document types
				skipAnimation
			/>
		</Paper>
	);
};

export default LineGraph;
