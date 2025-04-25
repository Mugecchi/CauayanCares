import React from "react";
import {
	Skeleton,
	Paper,
	useTheme,
	Stack,
	Box,
	Typography,
} from "@mui/material";
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
				flexDirection: "column",
				borderRadius: 2,
				width: "100%",
				height: "500px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				p: 2,
			}}
		>
			<BarChart
				layout={layout}
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
