import React, { lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "./Includes/Sidebar";
import Header from "./Includes/Header";
import { AuthProvider, useAuth } from "./Context";
import { ContentContainer, ThemeProv } from "./Includes/styledComponents";
import LoadingScreen from "./Includes/LoadingScreen";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Tables = lazy(() => import("./Pages/Tables"));
const Login = lazy(() => import("./Pages/Login"));
const Registration = lazy(() => import("./Pages/Registration"));
const DocumentationReps = lazy(() => import("./Components/DocumentationReps"));
const AddRecord = lazy(() => import("./Pages/AddRecord"));
const LogsTable = lazy(() => import("./Components/LogsTable"));

// Page wrapper for route animations
const PageWrapper = ({ children }) => (
	<motion.div
		initial={{ opacity: 0, y: 10, scale: 0.98 }}
		animate={{ opacity: 1, y: 0, scale: 1 }}
		exit={{ opacity: 0, y: -200, scale: 0.98 }}
		transition={{ duration: 0.4, ease: "easeInOut" }}
		style={{
			height: "100%",
			width: "100%",
			overflow: "hidden",
		}}
	>
		{children}
	</motion.div>
);

// Component to handle route rendering with animation
const AnimatedRoutes = ({ isLoggedIn, user, setIsLoggedIn }) => {
	const location = useLocation();

	const ProtectedRoute = ({ element, role }) => {
		if (!isLoggedIn) return <Navigate to="/login" />;
		if (role && user?.role !== role) return <Navigate to="/dashboard" />;
		return element;
	};

	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Navigate to="/dashboard" />} />
				<Route
					path="/addrecords"
					element={
						<ProtectedRoute
							element={
								<PageWrapper>
									<AddRecord />
								</PageWrapper>
							}
						/>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute
							element={
								<PageWrapper>
									<Dashboard />
								</PageWrapper>
							}
						/>
					}
				/>
				<Route
					path="/tables"
					element={
						<ProtectedRoute
							element={
								<PageWrapper>
									<Tables />
								</PageWrapper>
							}
						/>
					}
				/>
				<Route
					path="/documentation"
					element={
						<ProtectedRoute
							element={
								<PageWrapper>
									<DocumentationReps />
								</PageWrapper>
							}
						/>
					}
				/>
				<Route
					path="/logs"
					element={
						<ProtectedRoute
							element={
								<PageWrapper>
									<LogsTable />
								</PageWrapper>
							}
						/>
					}
				/>
				<Route
					path="/users"
					element={
						<ProtectedRoute
							element={
								<PageWrapper>
									<Registration />
								</PageWrapper>
							}
						/>
					}
				/>
				<Route
					path="/login"
					element={
						isLoggedIn ? (
							<Navigate to="/" />
						) : (
							<PageWrapper>
								<Login setIsLoggedIn={setIsLoggedIn} />
							</PageWrapper>
						)
					}
				/>
			</Routes>
		</AnimatePresence>
	);
};

const App = () => {
	const { isLoggedIn, user, loading, setIsLoggedIn } = useAuth();

	if (loading) return <LoadingScreen />;

	return (
		<AuthProvider>
			<Router>
				<div
					style={{
						display: "flex",
						height: "100vh",
						width: "100vw",
						overflow: "hidden",
					}}
				>
					{isLoggedIn && <Sidebar />}
					<div
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							overflow: "hidden",
						}}
					>
						{isLoggedIn && <Header user={user} />}
						<div
							style={{
								padding: isLoggedIn ? "20px" : 0,
								overflowY: "auto",
								flex: 1,
							}}
						>
							<ThemeProv>
								<ContentContainer>
									<Suspense fallback={<LoadingScreen />}>
										<AnimatedRoutes
											isLoggedIn={isLoggedIn}
											user={user}
											setIsLoggedIn={setIsLoggedIn}
										/>
									</Suspense>
								</ContentContainer>
							</ThemeProv>
						</div>
					</div>
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
