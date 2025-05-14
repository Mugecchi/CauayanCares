import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { fetchDates, fetchSource, fetchStatus, fetchTarget } from "../api";
import DonutChart from "../Charts/DonutChart";
import StatusBarChart from "../Charts/StatusBarChart";
import LineGraph from "../Charts/LineGraph";
import FlatBarChart from "../Charts/FlatBarChart";
import { useTheme } from "@emotion/react";
const Dashboard = () => {
	const [status, setStatus] = useState();
	const [date, setDate] = useState();
	const [source, setSource] = useState();
	const [target, setTarget] = useState();

	// Separate loading states
	const [loadingStatus, setLoadingStatus] = useState(true);
	const [loadingDate, setLoadingDate] = useState(true);
	const [loadingSource, setLoadingSource] = useState(true);
	const [loadingTarget, setLoadingTarget] = useState(false);

	useEffect(() => {
		// Fetch each independently
		const getStatus = async () => {
			try {
				const Status = await fetchStatus();
				setStatus(Status);
			} catch (error) {
				console.error("Failed to fetch status", error);
			} finally {
				setLoadingStatus(false);
			}
		};

		const getDates = async () => {
			try {
				const Dates = await fetchDates();
				setDate(Dates);
			} catch (error) {
				console.error("Failed to fetch dates", error);
			} finally {
				setLoadingDate(false);
			}
		};

		const getSource = async () => {
			try {
				const Sources = await fetchSource();
				setSource(Sources);
			} catch (error) {
				console.error("Failed to fetch source", error);
			} finally {
				setLoadingSource(false);
			}
		};
		const getTarget = async () => {
			try {
				const Target = await fetchTarget();
				setTarget(Target);
			} catch (error) {
				console.error("Failed to Fetch Target Beneficiaries");
			} finally {
				setLoadingTarget(false);
			}
		};
		getTarget();
		getStatus();
		getDates();
		getSource();
	}, []);

	const documentTypes = status?.document_types || {};
	const statuses = status?.statuses || {};
	const filteredDocumentTypes = Object.fromEntries(
		Object.entries(documentTypes).filter(([key]) => !key.includes("_statuses"))
	);
	const theme = useTheme();

	const fundingColor = ["#F9F3DF", "#CDF2CA", "#FFDEFA", "#FFC898"];
	const pastelPalette = [
		theme.palette.primary.main,
		theme.palette.secondary.main,
		theme.palette.error.main,
		theme.palette.warning.main,
		theme.palette.success.main,
	];

	return (
		<Box sx={{ flexGrow: 1, p: 0 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<StatusBarChart
						data={documentTypes}
						statuses={statuses}
						isLoading={loadingStatus}
					/>
				</Grid>

				<Grid item xs={12}>
					<LineGraph
						data={date}
						colors={["#FF7704"]}
						title={"Historical Data"}
						isLoading={loadingDate}
					/>
				</Grid>
				<Grid item xs={6}>
					<DonutChart
						title={"Document Types"}
						data={filteredDocumentTypes}
						colorPalette={pastelPalette}
						isLoading={loadingStatus}
					/>
				</Grid>

				<Grid item xs={6}>
					<DonutChart
						title={"Funding Source"}
						data={source}
						colorPalette={pastelPalette}
						isLoading={loadingSource}
					/>
				</Grid>
				<Grid item xs={12}>
					<FlatBarChart
						title="Target Beneficiaries"
						data={target}
						colors={["var(--eminence)"]} // MUI built-in palette
						isLoading={loadingTarget}
						layout="horizontal"
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
