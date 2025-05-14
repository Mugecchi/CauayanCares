import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/material";
import {
	ChartsLegend,
	ChartsTooltip,
	PiePlot,
	ResponsiveChartContainer,
} from "@mui/x-charts";

function DonutChart({
	title,
	data = {},
	colorPalette = [
		"#FF5722",
		"#4CAF50",
		"#FFC107",
		"#2196F3",
		"#9C27B0",
		"#3F51B5",
	],
	isLoading,
}) {
	// Ensure colorPalette is an array
	colorPalette = Array.isArray(colorPalette) ? colorPalette : [];

	const chartData = Object.entries(data).map(([key, value], index) => ({
		id: index,
		value: value || 0,
		label: key
			.replace(/_/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase()),
		color: colorPalette[index % colorPalette.length], // Use 'color' directly
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
					overflow: "hidden",
					p: 2,
				}}
			>
				<Skeleton
					variant="rectangular"
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
			display="flex"
			width="100%"
			overflow="hidden"
			sx={{
				backdropFilter: "blur(10px)", // 100px is extreme and often ineffective
				WebkitBackdropFilter: "blur(10px)", // Safari support
				backgroundColor: "rgba(255, 255, 255, 0.22)", // Add transparency
				borderRadius: 2,
				width: "100%",
				display: "flex",
				color: "white",
				alignItems: "center",
				p: 2,
			}}
			elevation={5}
		>
			{/* Chart Area */}
			<ResponsiveChartContainer
				series={[
					{
						type: "pie",
						data: chartData,
						innerRadius: 40,
						outerRadius: 130,
						paddingAngle: 5,
						cornerRadius: 20,
						cx: 200,
						label: "Sex",
						highlightScope: { fade: "global", highlight: "item" },
						highlighted: { additionalRadius: 10 },
						faded: { innerRadius: 40, additionalRadius: -30, color: "gray" },
					},
				]}
				height={300}
				sx={{
					"& text": {
						fill: "#fff !important",
						color: "#fff", // Sets all text in the chart to white
					},
					"& .MuiPieArc-root": {
						stroke: "transparent",
					},
				}}
			>
				<ChartsTooltip trigger="item" />
				<PiePlot
					sx={{
						"& text": {
							fill: "#fff !important",
							color: "#fff", // Sets all text in the chart to white
						},
						"& .MuiPieArc-root": {
							stroke: "transparent",
						},
					}}
				/>

				<ChartsLegend
					slotProps={{
						legend: {
							padding: -10,
							direction: "column",
							position: { vertical: "middle", horizontal: "right" },
						},
					}}
				/>
			</ResponsiveChartContainer>
			{/* Legend manually rendered */}
		</Paper>
	);
}

export default DonutChart;
