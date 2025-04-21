import React from "react";
import { PieChart, PiePlot } from "@mui/x-charts/PieChart";
import { Typography, Box } from "@mui/material";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartsLegend } from "@mui/x-charts/ChartsLegend";
import { ChartsTooltip } from "@mui/x-charts";
function DonutChart({
	title,
	documentTypes = {},
	colorPalette = [
		"#FF5722",
		"#4CAF50",
		"#FFC107",
		"#2196F3",
		"#9C27B0",
		"#3F51B5",
	],
}) {
	// Ensure colorPalette is an array
	colorPalette = Array.isArray(colorPalette) ? colorPalette : [];

	const chartData = Object.entries(documentTypes).map(
		([key, value], index) => ({
			id: index,
			value: value || 0,
			label: key
				.replace(/_/g, " ")
				.replace(/\b\w/g, (char) => char.toUpperCase()),
			color: colorPalette[index % colorPalette.length], // Use 'color' directly
		})
	);
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			flexGrow={1}
			width="100%"
			overflow="hidden"
			justifyContent="space-between"
		>
			<Typography variant="h6" align="center" gutterBottom>
				{title || "Label"}
			</Typography>{" "}
			<PieChart
				slotProps={{
					legend: {
						padding: -10,
						position: { vertical: "middle", horizontal: "right" },
					},
				}} // Adjust legend position as needed
				series={[
					{
						data: chartData, // Now uses 'color'
						innerRadius: 60,
						outerRadius: 150,
						paddingAngle: 5,
						cornerRadius: 5,
						startAngle: 0,
						endAngle: 360,
						cx: "50%",
						cy: "50%",
					},
				]}
				width={500}
				height={400}
			/>
		</Box>
	);
}

export default DonutChart;
