import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { fetchDashboardCounts } from "../api"; // Import API function
import DonutChart from "../Charts/DonutChart";
import StatusBarChart from "../Charts/StatusBarChart"; // Import your chart component
import LineGraph from "../Charts/LineGraph";
const Dashboard = () => {
	const [counts, setCounts] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getDashboardData();
	}, [10000]);

	const getDashboardData = async () => {
		try {
			const data = await fetchDashboardCounts();
			setCounts(data || {}); // Ensure it's never null
		} catch (error) {
			console.error("Error fetching dashboard counts:", error);
			setCounts({}); // Set empty object to avoid crashes
		} finally {
			setLoading(false);
		}
	};

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
	// Extract document types (excluding statuses) and statuses
	const documentTypes = counts?.document_types || {};
	const statuses = counts?.statuses || {};

	// Filter out document types statuses for DonutChart
	const filteredDocumentTypes = Object.fromEntries(
		Object.entries(documentTypes).filter(
			([key]) => !key.includes("_statuses") // Remove keys with '_statuses'
		)
	);
	const fundingSource = counts?.funding_source || {};
	const fundingColor = ["#F9F3DF", "#CDF2CA", "#FFDEFA", "#FFC898"];
	const pastelPalette = [
		"#F9B7D4", // Light Pink (Cotton Candy)
		"#B3E0DC", // Pale Teal (Soft Breeze)
		"#F6C7B6", // Peachy Beige (Peach Blossom)
		"#D1E6F4", // Powder Blue (Sky Kiss)
		"#F0D7B6", // Pale Yellow (Lemon Drop)
		"#D7C0E0", // Light Lavender (Lavender Mist)
	];

	const dates = counts?.date_issued || {};
	return (
		<Box sx={{ flexGrow: 1, p: 0 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					{/* Pass the full counts to StatusBarChart */}
					<StatusBarChart documentTypes={documentTypes} statuses={statuses} />
				</Grid>
				<Grid item xs={12}>
					<Paper>
						<LineGraph
							documentTypes={dates}
							colors={["#FF7704"]}
							title={"Historical Data"}
						/>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper>
						{/* Pass the filtered document types to DonutChart */}
						<DonutChart
							title={"Document Types"}
							documentTypes={filteredDocumentTypes}
							colorPalette={pastelPalette}
						/>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper>
						<DonutChart
							documentTypes={fundingSource}
							title={"Funding Source"}
							colorPalette={fundingColor}
						/>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper></Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
