import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Includes/Sidebar";
import ManageForms from "./Pages/ManageForms";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";

const App = () => {
	return (
		<Router>
			<div style={{ display: "flex", height: "100vh" }}>
				<Sidebar />
				<div
					style={{
						padding: "20px",
						marginLeft: "auto",
						width: "100%",
						overflowY: "auto",
					}}
				>
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/ManageForms" element={<ManageForms />} />
						<Route path="/Dashboard" element={<Dashboard />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
};

export default App;
