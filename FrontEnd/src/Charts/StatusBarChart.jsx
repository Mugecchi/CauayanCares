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
			<BarChart
				borderRadius={5}
				xAxis={[
					{
						scaleType: "band", // Keeping this as 'band' for categorical x-axis
						data: statusLabels, // Ensure these are categorical labels
					},
				]}
				series={seriesData}
			/>
		</Paper>
	);
};

export default StatusBarChart;
