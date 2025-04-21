import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Paper, Grid } from "@mui/material";
import { fetchDashboardCounts } from "../api";
import DonutChart from "../Charts/DonutChart";
import StatusBarChart from "../Charts/StatusBarChart";
import LineGraph from "../Charts/LineGraph";

const Dashboard = () => {
	const [counts, setCounts] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const interval = setInterval(getDashboardData, 10000); // Refresh every 10s
		getDashboardData(); // Initial fetch
		return () => clearInterval(interval); // Cleanup
	}, []);

	const getDashboardData = async () => {
		try {
			const data = await fetchDashboardCounts();
			setCounts(data || {});
		} catch (error) {
			console.error("Error fetching dashboard counts:", error);
			setCounts({});
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

	const {
		document_types = {},
		statuses = {},
		funding_source = {},
		date_issued = {},
	} = counts;

	// Filter document types to exclude keys like "_statuses"
	const filteredDocumentTypes = Object.fromEntries(
		Object.entries(document_types).filter(([key]) => !key.includes("_statuses"))
	);

	const fundingColor = ["#F9F3DF", "#CDF2CA", "#FFDEFA", "#FFC898"];
	const pastelPalette = [
		"#F9B7D4",
		"#B3E0DC",
		"#F6C7B6",
		"#D1E6F4",
		"#F0D7B6",
		"#D7C0E0",
	];

	return (
		<Box sx={{ flexGrow: 1, p: 0 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<StatusBarChart documentTypes={document_types} statuses={statuses} />
				</Grid>

				<Grid item xs={12}>
					<Paper sx={{ p: 2 }}>
						<LineGraph
							documentTypes={date_issued}
							colors={["#FF7704"]}
							title="Historical Data"
						/>
					</Paper>
				</Grid>

				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 2 }}>
						<DonutChart
							title="Document Types"
							documentTypes={filteredDocumentTypes}
							colorPalette={pastelPalette}
						/>
					</Paper>
				</Grid>

				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 2 }}>
						<DonutChart
							title="Funding Source"
							documentTypes={funding_source}
							colorPalette={fundingColor}
						/>
					</Paper>
				</Grid>

				<Grid item xs={12}>
					<Paper sx={{ p: 2 }}>
						{/* Add future charts or tables here */}
						<Box textAlign="center" color="gray">
							More visualizations coming soon...
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
