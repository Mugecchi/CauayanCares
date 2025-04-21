import React, { useState } from "react";
import EOTable from "../Components/EOTable";
import CoverageTable from "../Components/CoverageTable";
import ObjectivesTable from "../Components/ObjectivesTable";
import { CustomTabs, CustomTab, WhiteBox } from "../Includes/styledComponents"; // Import styled components
import BudgetTable from "../Components/BudgetTable";
import MonitoringTable from "../Components/MonitoringTable";
import IASsesment from "../Components/iAssesment";
import AllTables from "../Components/AllTables";

// ✅ Define Custom MUI Theme (Overrides TableRow height globally)

function Tables() {
	const [selectedTab, setSelectedTab] = useState(0);

	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	return (
		<WhiteBox>
			<CustomTabs value={selectedTab} onChange={handleTabChange}>
				<CustomTab label="All Records" />
				<CustomTab label="Records Table" />
				<CustomTab label="Coverage Table" />
				<CustomTab label="Objectives Table" />
				<CustomTab label="Budget Table" />
				<CustomTab label="Records Monitoring Table" />
				<CustomTab label="Impact Assessment Table" />
			</CustomTabs>
			<div style={{ marginTop: "30px" }}>
				{selectedTab === 0 && <AllTables formType="A" />}
				{selectedTab === 1 && <EOTable formType="B" />}
				{selectedTab === 2 && <CoverageTable formType="C" />}
				{selectedTab === 3 && <ObjectivesTable formType="D" />}
				{selectedTab === 4 && <BudgetTable formType="E" />}
				{selectedTab === 5 && <MonitoringTable formType="F" />}
				{selectedTab === 6 && <IASsesment formType="G" />}
			</div>
		</WhiteBox>
	);
}

export default Tables;
