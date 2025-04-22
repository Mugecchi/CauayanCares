import React from "react";
import { Box, Paper, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const StatusBarChart = ({ data = {}, colors = [] }) => {
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
			<BarChart
				borderRadius={5}
				xAxis={[{ scaleType: "band", data: statusLabels }]}
				series={seriesData}
			/>
		</Paper>
	);
};

export default StatusBarChart;
