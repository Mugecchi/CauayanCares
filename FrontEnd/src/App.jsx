import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import axios from "axios";
import Sidebar from "./Includes/Sidebar";
import Header from "./Includes/Header"; // ✅ Import Header component
import Tables from "./Pages/Tables";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import GlobalStyles from "./GlobalStyles";

const BASE_URL = "http://localhost:5000"; // Update this if necessary

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(
		!!localStorage.getItem("userToken")
	);
	const [user, setUser] = useState(null); // ✅ State for user data

	useEffect(() => {
		const token = localStorage.getItem("userToken");
		if (token) {
			setIsLoggedIn(true);
			fetchUser(); // ✅ Fetch user details
		} else {
			setIsLoggedIn(false);
		}
	}, []);

	// ✅ Fetch user details
	const fetchUser = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/api/protected`, {
				withCredentials: true,
			});
			setUser(response.data.user);
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	};

	return (
		<Router>
			<GlobalStyles />
			<div style={{ display: "flex", height: "100vh" }}>
				{isLoggedIn && <Sidebar />}
				<div
					style={{ width: "100%", display: "flex", flexDirection: "column" }}
				>
					{isLoggedIn && <Header user={user} />} {/* ✅ Show Header */}
					<div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
						<Routes>
							<Route
								path="/login"
								element={<Login setIsLoggedIn={setIsLoggedIn} />}
							/>
							<Route
								path="/"
								element={
									isLoggedIn ? (
										<Navigate to="/Dashboard" />
									) : (
										<Navigate to="/login" />
									)
								}
							/>
							<Route
								path="/Tables"
								element={isLoggedIn ? <Tables /> : <Navigate to="/login" />}
							/>
							<Route
								path="/Dashboard"
								element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
							/>
						</Routes>
					</div>
				</div>
			</div>
		</Router>
	);
};

export default App;
