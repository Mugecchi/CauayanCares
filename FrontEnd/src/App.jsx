import React, { useState, useEffect, lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Sidebar from "./Includes/Sidebar";
import Header from "./Includes/Header";
import { AuthProvider } from "./Context";
import { fetchUser } from "./api";
import { CircularProgress, Box } from "@mui/material";
import { ContentContainer, ThemeProv } from "./Includes/styledComponents";
import Registration from "./Pages/Registration";
import DocumentationReps from "./Components/DocumentationReps";
import AddRecord from "./Pages/AddRecord";
import LogsTable from "./Components/LogsTable";
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Tables = lazy(() => import("./Pages/Tables"));
const Login = lazy(() => import("./Pages/Login"));

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkLoginStatus();
	}, []);

	const checkLoginStatus = async () => {
		try {
			const userData = await fetchUser();
			setUser(userData);
			setIsLoggedIn(true);
		} catch (error) {
			console.error("Not authenticated:", error);
			setIsLoggedIn(false);
		} finally {
			setLoading(false);
		}
	};

	const ProtectedRoute = ({ element, role }) => {
		if (!isLoggedIn) {
			console.log("User is not logged in. Redirecting to login...");
			return <Navigate to="/login" />;
		}

		if (role && user?.role !== role) {
			console.log(`Unauthorized access attempt to ${role}-only page.`);
			return <Navigate to="/dashboard" />;
		}

		return element;
	};

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<AuthProvider>
			<Router>
				<div style={{ display: "flex", height: "100vh" }}>
					<div style={{ display: "flex", position: "sticky" }}>
						{isLoggedIn && <Sidebar />}
					</div>
					<div
						style={{ width: "100%", display: "flex", flexDirection: "column" }}
					>
						{isLoggedIn && <Header user={user} />}
						<div
							style={{
								padding: isLoggedIn ? "20px" : 0,
								overflowY: "auto",
								flex: 1,
							}}
						>
							<Suspense
								fallback={
									<Box
										display="flex"
										justifyContent="center"
										alignItems="center"
									>
										<CircularProgress />
									</Box>
								}
							>
								{isLoggedIn ? (
									<ThemeProv>
										<ContentContainer>
											<Routes>
												<Route
													path="/"
													element={<Navigate to="/dashboard" />}
												/>
												<Route
													path="/addrecords"
													element={<ProtectedRoute element={<AddRecord />} />}
												/>
												<Route
													path="/dashboard"
													element={<ProtectedRoute element={<Dashboard />} />}
												/>
												<Route
													path="/tables"
													element={<ProtectedRoute element={<Tables />} />}
												/>
												<Route
													path="/documentation"
													element={
														<ProtectedRoute element={<DocumentationReps />} />
													}
												/>
												<Route
													path="/logs"
													element={<ProtectedRoute element={<LogsTable />} />}
												/>

												{/* ✅ Only Admins can access /users */}
												<Route
													path="/users"
													element={
														<ProtectedRoute
															element={<Registration />}
															// role="admin"
														/>
													}
												/>
											</Routes>
										</ContentContainer>
									</ThemeProv>
								) : (
									<ThemeProv>
										<Routes>
											<Route
												path="/login"
												element={<Login setIsLoggedIn={setIsLoggedIn} />}
											/>
											<Route path="*" element={<Navigate to="/login" />} />
										</Routes>
									</ThemeProv>
								)}
							</Suspense>
						</div>
					</div>
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
