import { Box, createTheme, ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import EOTable from "../Components/EOTable";
import CoverageTable from "../Components/CoverageTable";
import ObjectivesTable from "../Components/ObjectivesTable";
import {
  CustomTabs,
  CustomTab,
  ThemeProv,
  WhiteBox,
} from "../Includes/styledComponents"; // Import styled components
import BudgetTable from "../Components/BudgetTable";

// ✅ Define Custom MUI Theme (Overrides TableRow height globally)

function Tables() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <ThemeProv>
      <CustomTabs value={selectedTab} onChange={handleTabChange}>
        <CustomTab label="Ordinance Tables" />
        <CustomTab label="Coverage" />
        <CustomTab label="Objectives" />
        <CustomTab label="Budget" />
      </CustomTabs>

      <WhiteBox sx={{ borderRadius: " 0   0 10px 10px" }}>
        {selectedTab === 0 && <EOTable formType="A" />}
        {selectedTab === 1 && <CoverageTable formType="B" />}
        {selectedTab === 2 && <ObjectivesTable formType="C" />}
        {selectedTab === 3 && <BudgetTable formType="D" />}
      </WhiteBox>
    </ThemeProv>
  );
}

export default Tables;
