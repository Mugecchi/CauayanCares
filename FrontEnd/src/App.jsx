import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Includes/Sidebar";
import Header from "./Includes/Header";
import GlobalStyles from "./GlobalStyles";
import { AuthProvider } from "./Context";
import { fetchUser } from "./api";
import { CircularProgress, Box } from "@mui/material";

const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Tables = lazy(() => import("./Pages/Tables"));
const Forms = lazy(() => import("./Pages/Forms"));
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

  // ✅ Protected Route Wrapper
  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  // ✅ Loading Indicator While Fetching Authentication Status
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
        <GlobalStyles />
        <div style={{ display: "flex", height: "100vh" }}>
          {isLoggedIn && <Sidebar />}
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            {isLoggedIn && <Header user={user} />}
            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
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
                <Routes>
                  {/* 🔹 Redirect to Dashboard if Logged In */}
                  <Route
                    path="/"
                    element={
                      <Navigate to={isLoggedIn ? "/dashboard" : "/login"} />
                    }
                  />

                  {/* 🔹 Public Route for Login */}
                  <Route
                    path="/login"
                    element={<Login setIsLoggedIn={setIsLoggedIn} />}
                  />

                  {/* 🔹 Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute element={<Dashboard />} />}
                  />
                  <Route
                    path="/tables"
                    element={<ProtectedRoute element={<Tables />} />}
                  />
                  <Route
                    path="/forms"
                    element={<ProtectedRoute element={<Forms />} />}
                  />
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
