import { Box, Grid2, Typography } from "@mui/material";
import React from "react";
import EOTable from "../Components/EOTable";
import EOForm from "../Components/EOForms";
import AddCoverageScope from "../Components/AddCoverageScope";
import CoverageTable from "../Components/CoverageTable";
import AddObjectives from "../Components/AddObjectives";
import ObjectivesTable from "../Components/ObjectivesTable";

function ViewForms() {
	return (
		<>
			<Box
				sx={{
					p: 4,
					height: "calc(100vh - 40px)",
					display: "flex",
					background: "#fff",
					borderRadius: "10px",
				}}
			>
				<Grid2
					container
					spacing={2}
					sx={{
						display: "flex",
						flexDirection: "row",
						overflowY: "scroll",
					}}
				>
					<Grid2>
						<EOTable />
					</Grid2>
				</Grid2>
			</Box>
		</>
	);
}

export default ViewForms;
