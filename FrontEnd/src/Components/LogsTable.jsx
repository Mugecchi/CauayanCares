import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Chip,
	CircularProgress,
} from "@mui/material";
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
		if (action.includes("added")) {
			return <Chip label={`${action}`} color="success" size="small" />;
		} else if (action.includes("edited")) {
			return <Chip label={`${action}`} color="warning" size="small" />;
		} else if (action.includes("deleted")) {
			return <Chip label={`${action}`} color="error" size="small" />;
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
		<WhiteBox sx={{ padding: 2 }}>
			<Typography variant="h6" gutterBottom>
				Ordinance Activity Logs
			</Typography>

			{loading ? (
				<CircularProgress />
			) : logs.length === 0 ? (
				<Typography variant="body2">No logs found.</Typography>
			) : (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>User</TableCell>
								<TableCell>Record</TableCell>
								<TableCell>Activity</TableCell>
								<TableCell>Timestamp</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
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
