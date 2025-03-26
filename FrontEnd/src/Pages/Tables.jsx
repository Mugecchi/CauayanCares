import React, { useState } from "react";
import EOTable from "../Components/EOTable";
import CoverageTable from "../Components/CoverageTable";
import ObjectivesTable from "../Components/ObjectivesTable";
import { CustomTabs, CustomTab, ThemeProv } from "../Includes/styledComponents"; // Import styled components
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
		<ThemeProv>
			<CustomTabs value={selectedTab} onChange={handleTabChange}>
				<CustomTab label="Ordinance Tables" />
				<CustomTab label="Coverage" />
				<CustomTab label="Objectives" />
				<CustomTab label="Budget" />
				<CustomTab label="Records Monitoring" />
				<CustomTab label="IAS" />
			</CustomTabs>
			<div style={{ marginTop: "30px" }}>
				{selectedTab === 0 && <EOTable formType="A" />}
				{selectedTab === 1 && <CoverageTable formType="B" />}
				{selectedTab === 2 && <ObjectivesTable formType="C" />}
				{selectedTab === 3 && <BudgetTable formType="D" />}
				{selectedTab === 4 && <MonitoringTable formType="E" />}
				{selectedTab === 5 && <IASsesment formType="F" />}
			</div>
		</ThemeProv>
	);
}

export default Tables;
