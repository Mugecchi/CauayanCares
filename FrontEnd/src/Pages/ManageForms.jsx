import { Box, Grid2 } from "@mui/material";
import React from "react";
import EOTable from "../Components/EOTable";
import EOForm from "../Components/EOForms";
import AddCoverageScope from "../Components/AddCoverageScope";
import OrdinanceTable from "../Components/OrdinanceTable";

function ManageForms() {
	return (
		<Box>
			<Grid2
				container
				spacing={2}
				sx={{ display: "flex", flexDirection: "row" }}
			>
				<Grid2 size={{ xs: 12, md: 12 }}>
					<EOForm />
				</Grid2>
				<Grid2 size={{ xs: 12, md: 12 }}>
					<EOTable />
				</Grid2>
				<Grid2 size={{ xs: 12, md: 12 }}>
					<AddCoverageScope />
				</Grid2>
				<Grid2 size={{ xs: 12, md: 12 }}>
					<OrdinanceTable />
				</Grid2>
			</Grid2>
		</Box>
	);
}

export default ManageForms;
