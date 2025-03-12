import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useLocation } from "react-router-dom";

const Header = ({ user }) => {
	const location = useLocation();

	// ✅ Map routes to page names
	const pageTitles = {
		"/Dashboard": "Dashboard",
		"/Tables": "Tables",
		"/FormB": "Form B",
		"/login": "Login",
	};

	// Get the current page title based on location
	const pageTitle = pageTitles[location.pathname] || "Page";

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between", // ✅ Page title on the left, user info on the right
				alignItems: "center",
				padding: "15px 30px",
				position: "sticky",
				top: 0,
				zIndex: 1000,
			}}
		>
			{/* ✅ Page Title (Left Side) */}
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					color: "#ff7704 !important",
					textTransform: "uppercase", // Optional for style
				}}
			>
				{pageTitle}
			</Typography>

			{/* ✅ User Info (Right Side) */}
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography
					sx={{ marginRight: "15px", fontWeight: "bold", fontSize: "16px" }}
				>
					{user?.username || "Guest"}
				</Typography>
				<Avatar
					src={user?.profilePicture || "/default-avatar.png"} // ✅ Profile picture logic
					alt="Profile"
					sx={{ width: 40, height: 40 }}
				/>
			</Box>
		</Box>
	);
};

export default Header;
