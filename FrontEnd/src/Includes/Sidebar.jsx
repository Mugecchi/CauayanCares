import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout, fetchUser } from "../api"; // ✅ Import API functions
import { Box, Drawer, IconButton, CircularProgress } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableChartIcon from "@mui/icons-material/TableChart";
import GroupIcon from "@mui/icons-material/Group";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import {
	SidebarButton,
	SidebarContainer,
	SidebarList,
	SidebarTitle,
	SidebarItemIcon,
	SidebarItemText,
	LogoutButton,
	SidebarItem,
} from "./styledComponents";

export default function Sidebar() {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const location = useLocation();

	// ✅ Fetch user details
	useEffect(() => {
		const getUser = async () => {
			try {
				const userData = await fetchUser();
				setUser(userData);
			} catch (error) {
				console.error("Not authenticated:", error);
			} finally {
				setLoading(false);
			}
		};
		getUser();
	}, []);

	// ✅ Handle logout
	const handleLogout = async () => {
		setOpen(false);
		try {
			await logout();
			window.location.href = "/";
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	// ✅ Sidebar menu items (conditionally show User Management)
	const menuItems = [
		{ text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
		{ text: "Tables", path: "/tables", icon: <TableChartIcon /> },
	];

	// ✅ Add "User Management" only if user is an admin
	if (user?.role === "admin") {
		menuItems.push({
			text: "User Management",
			path: "/users",
			icon: <GroupIcon />,
		});
	}

	// ✅ Loading state while fetching user data
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
	// ✅ Sidebar Drawer Content
	const DrawerList = (
		<SidebarContainer>
			<Box>
				<SidebarTitle>CAUAYAN CARES</SidebarTitle>
				<SidebarList>
					{menuItems.map((item) => (
						<SidebarItem
							disablePadding
							sx={{ marginBottom: "10px" }}
							key={item.text}
						>
							<SidebarButton
								component={Link}
								to={item.path}
								onClick={() => setOpen(false)}
								sx={{
									backgroundColor:
										location.pathname === item.path ? "#fbaaff" : "transparent",
									"&:hover": { backgroundColor: "#fbaaff" },
									borderRadius: "5px",
									width: "100%",
									display: "flex",
									alignItems: "center",
									gap: "10px",
									color: "white",
								}}
							>
								<SidebarItemIcon>{item.icon}</SidebarItemIcon>
								<SidebarItemText
									primary={item.text}
									sx={{
										color: "white",
										fontWeight:
											location.pathname === item.path ? "bold" : "normal",
									}}
								/>
							</SidebarButton>
						</SidebarItem>
					))}
				</SidebarList>
			</Box>

			{/* Logout Button */}
			<LogoutButton
				onClick={handleLogout}
				sx={{
					backgroundColor: "transparent",
					color: "white",
					margin: "10px",
					"&:hover": { backgroundColor: "#e06505" },
				}}
				startIcon={<ExitToAppIcon />}
			>
				Logout
			</LogoutButton>
		</SidebarContainer>
	);

	return (
		<>
			{/* Mobile Sidebar Toggle Button */}
			<IconButton
				onClick={() => setOpen(true)}
				sx={{
					bottom: "20%",
					left: "20%",
					position: { xs: "absolute", md: "sticky" },
					zIndex: 1000000,
					backgroundColor: "#5D3786",
					color: "white",
					borderRadius: "50%",
					width: "50px",
					height: "50px",
					boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
					"&:hover": { backgroundColor: "#ff7706", color: "white" },
					display: { xs: "block", md: "none" },
				}}
			>
				<MenuIcon />
			</IconButton>

			{/* Desktop Sidebar */}
			<Box sx={{ display: { xs: "none", sm: "block" }, width: "250px" }}>
				{DrawerList}
			</Box>

			{/* Mobile Sidebar Drawer */}
			<Drawer open={open} onClose={() => setOpen(false)}>
				{DrawerList}
			</Drawer>
		</>
	);
}
