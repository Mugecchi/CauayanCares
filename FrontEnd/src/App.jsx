import React, { lazy } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Includes/Sidebar";
import Header from "./Includes/Header";
import { AuthProvider, useAuth } from "./Context"; // Import useAuth
import { CircularProgress, Box } from "@mui/material";
import { ContentContainer, ThemeProv } from "./Includes/styledComponents";

// Lazy load pages
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Tables = lazy(() => import("./Pages/Tables"));
const Login = lazy(() => import("./Pages/Login"));
const Registration = lazy(() => import("./Pages/Registration"));
const DocumentationReps = lazy(() => import("./Components/DocumentationReps"));
const AddRecord = lazy(() => import("./Pages/AddRecord"));
const LogsTable = lazy(() => import("./Components/LogsTable"));

const App = () => {
	// Consume Auth context values using the useAuth hook
	const { isLoggedIn, user, loading, setIsLoggedIn } = useAuth();

	// Protected route wrapper
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
			<div style={{ display: "flex", height: "100vh" }}>
				<div>{isLoggedIn && <Sidebar />}</div>
				<div
					style={{ width: "100%", display: "flex", flexDirection: "column" }}
				>
					{isLoggedIn && <Header user={user} />}
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						flex={1}
						flexDirection="column"
						gap={3}
					>
						{/* 🔄 Spinning and Growing Logo */}
						<motion.img
							src="logo.png"
							alt="Loading..."
							style={{ width: 100, height: 100 }}
							initial={{ scale: 0 }}
							animate={{
								rotateY: [0, 360],
								scale: [0.8, 2, 3],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatType: "loop",
								ease: "linear",
							}}
						/>

						{/* 🌀 CircularProgress with Fade In */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
						>
							<CircularProgress size={60} />
						</motion.div>

						{/* ✨ Pulsing Text */}
						<motion.p
							style={{ fontSize: "1.2rem", fontWeight: 500 }}
							initial={{ opacity: 0 }}
							animate={{ opacity: [0.5, 1, 0.5] }}
							transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						>
							Loading, please wait...
						</motion.p>
					</Box>
				</div>
			</div>
		);
	}
	return (
		<AuthProvider>
			<Router>
				<div style={{ display: "flex", height: "100vh" }}>
					<div>{isLoggedIn && <Sidebar />}</div>
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
							{isLoggedIn ? (
								<ThemeProv>
									<ContentContainer>
										<Routes>
											<Route path="/" element={<Navigate to="/dashboard" />} />
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
											<Route
												path="/users"
												element={<ProtectedRoute element={<Registration />} />}
											/>
											<Route
												path="/login"
												element={
													isLoggedIn ? (
														<Navigate to="/" />
													) : (
														<Login setIsLoggedIn={setIsLoggedIn} />
													)
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
						</div>
					</div>
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
