import React from "react";

import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import useTheme from "@mui/material/styles/useTheme";
import { BarChart } from "@mui/x-charts/BarChart";

const StatusBarChart = ({ data = {}, colors = [], isLoading }) => {
	const theme = useTheme();
	const defaultColors = [
		theme.palette.primary.main,
		theme.palette.secondary.main,
		theme.palette.error.main,
		theme.palette.warning.main,
		theme.palette.success.main,
	];

	const statusLabels = [
		"Pending",
		"Approved",
		"Amended",
		"Under Review",
		"Implemented",
	];

	const seriesData = Object.keys(data)
		.filter((key) => !key.includes("_statuses")) // Get only doc type keys
		.map((dat, index) => ({
			data: statusLabels.map(
				(status) => data[`${dat}_statuses`]?.[status.toLowerCase()] || 0
			),
			label: dat.replace("_", " ").toUpperCase(),
			color: colors[index] || defaultColors[index % defaultColors.length], // Use provided color or fallback
		}));

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
					p: 0,
					m: 0,
					overflow: "hidden",
				}}
			>
				<Skeleton
					variant="rectangular"
					animation="wave"
					width="200%"
					height="200%"
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
			<BarChart
				sx={{
					"& text": {
						fill: "#fff !important",
						color: "#fff", // Sets all text in the chart to white
					},
					"& .MuiChartsLegend-root": {
						color: "#fff", // Applies to legend text
						fill: "#fff",
					},
					"& .MuiChartsLegend-row": {
						color: "#fff", // Applies to legend text
						fill: "#fff",
					},
					"& .MuiChartsAxis-tickLabel": {
						color: "#fff", // Applies to legend text

						fill: "#fff", // X/Y axis tick labels
					},
					"& .MuiChartsAxis-label": {
						color: "#fff", // Applies to legend text

						fill: "#fff", // Axis main labels
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
				borderRadius={5}
				xAxis={[
					{
						scaleType: "band",
						data: statusLabels,
					},
				]}
				slotProps={{
					legend: {
						color: "white",
					},
				}}
				series={seriesData}
			/>
		</Paper>
	);
};

export default StatusBarChart;
