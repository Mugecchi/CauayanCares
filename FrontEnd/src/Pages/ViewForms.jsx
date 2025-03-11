import { Box, createTheme, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import EOTable from "../Components/EOTable";
import CoverageTable from "../Components/CoverageTable";
import ObjectivesTable from "../Components/ObjectivesTable";
import { CustomTabs, CustomTab } from "../Includes/styledComponents"; // Import styled components

// ✅ Define Custom MUI Theme (Overrides TableRow height globally)
const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          p: 0, // Adjust row height here
        },
      },
    },
  },
});

function ViewForms() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Tabs Section */}
      <CustomTabs value={selectedTab} onChange={handleTabChange}>
        <CustomTab label="Ordinance Tables" />
        <CustomTab label="Coverage" />
        <CustomTab label="Objectives" />
      </CustomTabs>

      <Box
        sx={{
          p: 4,
          height: "calc(100vh - 100px)",
          display: "flex",
          background: "#fff",
          borderRadius: "10px",
          zIndex: 10,
          overflow: "auto",
          paddingTop: "0",
        }}
      >
        {selectedTab === 0 && <EOTable formType="A" />}
        {selectedTab === 1 && <CoverageTable formType="B" />}
        {selectedTab === 2 && <ObjectivesTable formType="C" />}
      </Box>
    </ThemeProvider>
  );
}

export default ViewForms;
