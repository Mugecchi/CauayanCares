import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EOTable from "./Components/EOTable";
import Sidebar from "./Includes/Sidebar";
const AppRouter = () => {
	return (
		<Router>
			<Sidebar />
			<Routes>
				<Route path="/ordinances" element={<EOTable />} />
				{/* Add more routes here */}
			</Routes>
		</Router>
	);
};

export default AppRouter;
