import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import Chart from "react-apexcharts";

const BASE_URL = "http://localhost:5000";

const Dashboard = () => {
	const [counts, setCounts] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCounts();
	}, []);

	const fetchCounts = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/api/dashboard`, {
				withCredentials: true, // Ensure credentials (cookies) are sent with the request
			});
			setCounts(response.data);
		} catch (error) {
			console.error("Error fetching ordinance counts:", error);
		} finally {
			setLoading(false);
		}
	};

	// Show loading indicator while fetching data
	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	// Define colors manually for each bar
	const colors = [
		"#5D3786",
		"#FF5722",
		"#4CAF50",
		"#FFC107",
		"#2196F3",
		"#9C27B0",
	];

	const chartOptions = {
		chart: {
			type: "bar",
			toolbar: { show: false },
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "50%",
				endingShape: "rounded",
				distributed: true,
			},
		},
		dataLabels: { enabled: false },
		xaxis: {
			categories: [
				"Total",
				"Pending",
				"Approved",
				"Amended",
				"Under Review",
				"Implemented",
			],
		},
		tooltip: { theme: "light" },
		colors: colors, // Set bar colors
		fill: { opacity: 1 },
	};

	const chartSeries = [
		{
			name: "Ordinances",
			data: [
				counts.ordinances_count,
				counts.pending_count,
				counts.approved_count,
				counts.amended_count,
				counts.under_review_count,
				counts.implemented_count,
			],
		},
	];

	return (
		<Box
			sx={{
				p: 4,
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				background: "#fff",
				borderRadius: "10px",
			}}
		>
			<Typography
				variant="h4"
				gutterBottom
				sx={{
					fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Adjust font size for different screens
					fontWeight: "bold",
					textAlign: "center",
				}}
			>
				Dashboard Overview
			</Typography>

			<Box sx={{ width: "100%", height: "100%", minHeight: "300px" }}>
				<Chart
					options={chartOptions}
					series={chartSeries}
					type="bar"
					width="100%"
					height="100%"
				/>
			</Box>
		</Box>
	);
};

export default Dashboard;
