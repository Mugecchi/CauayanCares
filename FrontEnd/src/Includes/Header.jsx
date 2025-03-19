import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useLocation } from "react-router-dom";
import { apiCall } from "../api"; // ✅ Import API helper function

const Header = () => {
	const location = useLocation();
	const [user, setUser] = useState(null);

	// ✅ Map routes to page names
	const pageTitles = {
		"/dashboard": "Dashboard",
		"/tables": "Tables",
		"/Forms": "Forms",
		"/login": "Login",
	};

	// ✅ Fetch user data on page load & route change
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await apiCall("get", "/user"); // ✅ Use `apiCall`
				setUser(userData);
			} catch (error) {
				setUser(null);
			}
		};
		fetchUser();
	}, [location.pathname]); // ✅ Runs every time the route changes

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "20px 25px 0 25px",
				position: "sticky",
				zIndex: 1000,
			}}
		>
			{/* ✅ Page Title (Left Side) */}
			<Typography
				sx={{
					fontSize: "30px",
					fontWeight: "bold",
					color: "#ff7704",
					textTransform: "uppercase",
				}}
			>
				{pageTitles[location.pathname] || "Page"}
			</Typography>

			{/* ✅ User Info (Right Side) */}
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography
					sx={{ marginRight: "15px", fontWeight: "bold", fontSize: "16px" }}
				>
					{user?.username || "Guest"}
				</Typography>
				<Avatar
					src={user?.profilePicture || "/default-avatar.png"}
					alt="Profile"
					sx={{ width: 40, height: 40 }}
				/>
			</Box>
		</Box>
	);
};

export default Header;
