import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

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
				const response = await axios.get("http://localhost:5000/api/user", {
					withCredentials: true, // Ensure session/cookie is included
				});
				setUser(response.data); // ✅ Store user data
			} catch (error) {
				setUser(null); // Clear user if error occurs
			}
		};
		fetchUser();
	}, [location.pathname]); // ✅ Runs every time the route changes

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				flexDirection: "row",
				textAlign: "center",
				alignItems: "center",
				padding: " 20px 25px 0 25px",
				position: "sticky",
				zIndex: 1000,
			}}
		>
			{/* ✅ Page Title (Left Side) */}
			<Typography
				sx={{
					fontSize: "30px",
					fontWeight: "bold",
					color: "#ff7704 !important",
					textTransform: "uppercase",
				}}
			>
				{pageTitles[location.pathname] || "Page"}
			</Typography>

			{/* ✅ User Info (Right Side) */}
			<Box sx={{ display: "flex", alignItems: "center", bottom: 10 }}>
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
