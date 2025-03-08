import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";

const BASE_URL = "http://localhost:5000";

const Test = () => {
	const [counts, setCounts] = useState({
		ordinances_count: 0,
		approved_count: 0,
		amended_count: 0,
		under_review_count: 0,
		implemented_count: 0,
	});

	useEffect(() => {
		fetchCounts();
	}, []);

	const fetchCounts = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/api/dashboard`);
			setCounts(response.data);
		} catch (error) {
			console.error("Error fetching ordinance counts:", error);
		}
	};

	return (
		<Grid2>
			<Typography variant="h4">Dashboard</Typography>
			<Grid2>
				<Box>
					<Grid2 container spacing={2} alignItems="center">
						{[
							{
								label: "Total Ordinances",
								count: counts.ordinances_count,
								color:
									"linear-gradient(to left, rgba(255,255,255,0.6), rgba(255,255,255,0)) , #5D3786",
							},
							{
								label: "Pending",
								count: counts.pending_count,
								color:
									"linear-gradient(to left, rgba(255,255,255,0.6), rgba(255,255,255,0)) , #5D3786",
							},
							{
								label: "Approved",
								count: counts.approved_count,
								color:
									"linear-gradient(to left, rgba(255,255,255,0.6), rgba(255,255,255,0)) , #4CAF50",
							},
							{
								label: "Amended",
								count: counts.amended_count,
								color:
									"linear-gradient(to left, rgba(255,255,255,0.6), rgba(255,255,255,0)) , #FFC107",
							},
							{
								label: "Under Review",
								count: counts.under_review_count,
								color:
									"linear-gradient(to left, rgba(255,255,255,0.6), rgba(255,255,255,0)) , #2196F3",
							},
							{
								label: "Implemented",
								count: counts.implemented_count,
								color:
									"linear-gradient(to left, rgba(255,255,255,0.6), rgba(255,255,255,0)) , #9C27B0",
							},
						].map((item, index) => (
							<Grid2
								item
								size={{ xs: 12, sm: 6, md: 4 }}
								sx={{ display: "flex" }}
								key={index}
							>
								<Card
									sx={{
										padding: 2,
										borderRadius: 2,
										background: item.color,
										color: "white",
										flex: "auto",
									}}
								>
									<CardContent>
										<Grid2
											container
											spacing={2}
											alignItems="center"
											justifyContent="center"
											direction="row"
										>
											<Typography variant="h6">{item.label}</Typography>
											<Typography variant="h3">{item.count}</Typography>
										</Grid2>
									</CardContent>
								</Card>
							</Grid2>
						))}
					</Grid2>
				</Box>
			</Grid2>
		</Grid2>
	);
};

export default Test;
