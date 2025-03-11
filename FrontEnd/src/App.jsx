import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Includes/Sidebar";
import ViewForms from "./Pages/ViewForms";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import GlobalStyles from "./GlobalStyles";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userToken") // Read from localStorage initially
  );

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <Router>
      <GlobalStyles />
      <div style={{ display: "flex", height: "100vh" }}>
        {isLoggedIn && <Sidebar />} {/* Show Sidebar only if logged in */}
        <div style={{ padding: "20px", width: "100%", overflowY: "auto" }}>
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
              path="/ViewForms"
              element={isLoggedIn ? <ViewForms /> : <Navigate to="/login" />}
            />
            <Route
              path="/Dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
