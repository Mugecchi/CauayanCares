import React, { useState } from "react";
import EOTable from "../Components/EOTable";
import CoverageTable from "../Components/CoverageTable";
import ObjectivesTable from "../Components/ObjectivesTable";
import { CustomTabs, CustomTab, WhiteBox } from "../Includes/styledComponents"; // Import styled components
import BudgetTable from "../Components/BudgetTable";
import MonitoringTable from "../Components/MonitoringTable";
import IASsesment from "../Components/iAssesment";

// ✅ Define Custom MUI Theme (Overrides TableRow height globally)

function Tables() {
	const [selectedTab, setSelectedTab] = useState(0);

	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	return (
		<WhiteBox>
			<CustomTabs value={selectedTab} onChange={handleTabChange}>
				<CustomTab label="Records Table" />
				<CustomTab label="Coverage Table" />
				<CustomTab label="Objectives Table" />
				<CustomTab label="Budget Table" />
				<CustomTab label="Records Monitoring Table" />
				<CustomTab label="Impact Assessment Table" />
			</CustomTabs>
			<div style={{ marginTop: "30px" }}>
				{selectedTab === 0 && <EOTable formType="A" />}
				{selectedTab === 1 && <CoverageTable formType="B" />}
				{selectedTab === 2 && <ObjectivesTable formType="C" />}
				{selectedTab === 3 && <BudgetTable formType="D" />}
				{selectedTab === 4 && <MonitoringTable formType="E" />}
				{selectedTab === 5 && <IASsesment formType="F" />}
			</div>
		</WhiteBox>
	);
}

export default Tables;
