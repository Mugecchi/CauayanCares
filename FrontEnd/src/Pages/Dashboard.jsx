import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Paper, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { fetchDashboardCounts } from "../api";
import DonutChart from "../Charts/DonutChart";
import StatusBarChart from "../Charts/StatusBarChart";
import LineGraph from "../Charts/LineGraph";

const Dashboard = () => {
	const [counts, setCounts] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getDashboardData();
	}, []); // ✅ Fix missing dependency array

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

	const documentTypes = counts?.document_types || {};
	const statuses = counts?.statuses || {};
	const filteredDocumentTypes = Object.fromEntries(
		Object.entries(documentTypes).filter(([key]) => !key.includes("_statuses"))
	);
	const fundingSource = counts?.funding_source || {};
	const dates = counts?.date_issued || {};

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
					<Paper sx={{ p: 2 }}>
						{loading ? (
							<Skeleton variant="rectangular" height={300} />
						) : (
							<StatusBarChart
								documentTypes={documentTypes}
								statuses={statuses}
							/>
						)}
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper sx={{ p: 2 }}>
						{loading ? (
							<Skeleton variant="rectangular" height={300} />
						) : (
							<LineGraph
								documentTypes={dates}
								colors={["#FF7704"]}
								title={"Historical Data"}
							/>
						)}
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper sx={{ p: 2 }}>
						{loading ? (
							<Skeleton
								variant="circular"
								width={250}
								height={250}
								sx={{ mx: "auto" }}
							/>
						) : (
							<DonutChart
								title={"Document Types"}
								documentTypes={filteredDocumentTypes}
								colorPalette={pastelPalette}
							/>
						)}
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper sx={{ p: 2 }}>
						{loading ? (
							<Skeleton
								variant="circular"
								width={250}
								height={250}
								sx={{ mx: "auto" }}
							/>
						) : (
							<DonutChart
								title={"Funding Source"}
								documentTypes={fundingSource}
								colorPalette={fundingColor}
							/>
						)}
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper sx={{ p: 2 }}>
						<Skeleton variant="rectangular" height={100} />
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
