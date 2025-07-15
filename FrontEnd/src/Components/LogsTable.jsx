import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { getLogs } from "../api"; // ✅ Ensure this returns a proper Promise resolving to { data: [...] }
import { WhiteBox } from "../Includes/styledComponents";

const LogsTable = () => {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const response = await getLogs();
				setLogs(response);
			} catch (error) {
				console.error("Error fetching logs:", error);
				setLogs([]);
			} finally {
				setLoading(false);
			}
		};

		fetchLogs();
	}, []);

	const renderActionChip = (action) => {
		const lowerAction = action.toLowerCase();

		if (lowerAction.includes("added")) {
			return <Chip label={action} color="success" size="small" />;
		} else if (lowerAction.includes("edited")) {
			return <Chip label={action} color="warning" size="small" />;
		} else if (lowerAction.includes("deleted")) {
			return <Chip label={action} color="error" size="small" />;
		} else {
			return (
				<Chip
					label={`Unknown Action: ${action}`}
					color="default"
					size="small"
				/>
			);
		}
	};

	return (
		<WhiteBox sx={{ padding: 10 }}>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<Typography
					variant="h5"
					gutterBottom
					fontWeight={600}
					sx={{
						color: "#f0f0f0",
					}}
				>
					Ordinance Activity Logs
				</Typography>
			</div>
			{loading ? (
				<CircularProgress />
			) : logs.length === 0 ? (
				<Typography variant="body2">No logs found.</Typography>
			) : (
				<TableContainer sx={{ minHeight: "75vh" }}>
					<Table sx={{ minHeight: "100vh" }}>
						<TableHead>
							<TableRow>
								<TableCell>User</TableCell>
								<TableCell>Record</TableCell>
								<TableCell>Activity</TableCell>
								<TableCell>Timestamp</TableCell>
							</TableRow>
						</TableHead>
						<TableBody sx={{ minHeight: "100vh" }}>
							{logs.map((log, index) => (
								<TableRow key={index}>
									<TableCell>{log.username || "Unknown User"}</TableCell>
									<TableCell>{` ${log.number}`}</TableCell>
									<TableCell>{renderActionChip(log.action)}</TableCell>
									<TableCell>
										{log.timestamp
											? new Date(log.timestamp).toLocaleString()
											: "No Date"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</WhiteBox>
	);
};

export default LogsTable;
