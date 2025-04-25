import React, { lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Sidebar from "./Includes/Sidebar";
import Header from "./Includes/Header";
import { AuthProvider, useAuth } from "./Context"; // Import useAuth
import { ContentContainer, ThemeProv } from "./Includes/styledComponents";
import LoadingScreen from "./Includes/LoadingScreen";

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
	if (loading) return <LoadingScreen />;

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
