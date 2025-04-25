import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

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
					p: 2,
				}}
			>
				<Skeleton variant="rectangular" width="100%" height="100%" />
			</Paper>
		);
	}
	return (
		<Paper display="flex" width="100%" overflow="hidden">
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
		</Paper>
	);
}

export default DonutChart;
