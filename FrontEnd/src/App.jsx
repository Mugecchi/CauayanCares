import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Sidebar from "./Includes/Sidebar";
import Header from "./Includes/Header";
import Tables from "./Pages/Tables";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import GlobalStyles from "./GlobalStyles";
import { AuthProvider } from "./Context";
import Forms from "./Pages/Forms";

const BASE_URL = "http://localhost:5000"; // Update if necessary

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userToken")
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
      fetchUser();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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

  // ✅ Protected Route Wrapper
  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

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
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
