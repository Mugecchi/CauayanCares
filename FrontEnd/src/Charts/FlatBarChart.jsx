import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import useTheme from "@mui/material/styles/useTheme";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { BarChart } from "@mui/x-charts/BarChart";

const FlatBarChart = ({
	data = {},
	colors = [],
	isLoading,
	layout = "vertical",
	title,
}) => {
	const theme = useTheme();

	const defaultColors = [
		theme.palette.primary.main,
		theme.palette.secondary.main,
		theme.palette.error.main,
		theme.palette.warning.main,
		theme.palette.success.main,
	];

	const labels = Object.keys(data);
	const values = Object.values(data);

	const seriesData = [
		{
			data: [...values],
			label: title,
			color: colors[0] || defaultColors[0],
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
					p: 0,
					m: 0,
					position: "relative", // Added position for background control
					overflow: "hidden", // Prevents overflow from background effects
				}}
			>
				<Skeleton
					sx={{
						background: "linear-gradient(90deg, #d4bcef, #e2d5f7, #d4bcef)",
						transform: "scale(1.1)", // Slight zoom effect if desired
					}}
					variant="rectangular"
					width="100%"
					height="100%"
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
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				p: 2,
			}}
			elevation={5}
		>
			<BarChart
				layout={layout}
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
				xAxis={
					layout === "vertical"
						? [
								{
									scaleType: "band",
									data: labels,
								},
						  ]
						: [
								{
									scaleType: "linear",
									valueFormatter: (value) =>
										Number.isInteger(value) ? value.toString() : "",
								},
						  ]
				}
				yAxis={
					layout === "horizontal"
						? [
								{
									scaleType: "band",
									data: labels,
									tickLabelStyle: {
										display: "none",
									},
								},
						  ]
						: [
								{
									scaleType: "linear",
									valueFormatter: (value) =>
										Number.isInteger(value) ? value.toString() : "",
								},
						  ]
				}
				series={seriesData}
			/>
			<Stack
				sx={{ color: "white" }}
				direction="row"
				justifyContent="flex-start"
				alignItems="center"
				flexWrap="wrap"
				gap={0.5}
				mt={0}
				pl={6}
			>
				{labels.map((label, index) => (
					<Stack
						key={label}
						direction="row"
						alignItems="center"
						spacing={1}
						sx={{
							minWidth: 120, // makes each item consistent
							p: 0.5,
							borderRadius: 1,
							backgroundColor: "rgba(0,0,0,0.04)",
						}}
					>
						<Box
							sx={{
								width: 16,
								height: 16,
								borderRadius: 1,
								backgroundColor: colors,
							}}
						/>
						<Typography variant="body2">{label}</Typography>
					</Stack>
				))}
			</Stack>
		</Paper>
	);
};

export default FlatBarChart;
