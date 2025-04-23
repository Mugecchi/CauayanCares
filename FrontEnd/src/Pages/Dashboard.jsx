import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Paper, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { fetchDashboardCounts } from "../api";
import DonutChart from "../Charts/DonutChart";
import StatusBarChart from "../Charts/StatusBarChart";
import LineGraph from "../Charts/LineGraph";

const Dashboard = () => {
	const [counts, setCounts] = useState();
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const getData = async () => {
			try {
				const res = await fetchDashboardCounts();
				setCounts(res);
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				setIsError(true);
			}
		};

		getData();
	}, []); // Empty dependency array to run once on mount

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
					<StatusBarChart
						data={documentTypes}
						statuses={statuses}
						isLoading={isLoading}
					/>
				</Grid>

				<Grid item xs={12}>
					<LineGraph
						data={dates}
						colors={["#FF7704"]}
						title={"Historical Data"}
						isLoading={isLoading}
					/>
				</Grid>

				<Grid item xs={6}>
					<DonutChart
						title={"Document Types"}
						data={filteredDocumentTypes}
						colorPalette={pastelPalette}
						isLoading={isLoading}
					/>
				</Grid>

				<Grid item xs={6}>
					<DonutChart
						title={"Funding Source"}
						data={fundingSource}
						colorPalette={fundingColor}
						isLoading={isLoading}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
