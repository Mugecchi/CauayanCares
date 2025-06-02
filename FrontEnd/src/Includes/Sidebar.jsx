import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../api";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import {
	Dashboard as DashboardIcon,
	TableChart as TableChartIcon,
	Group as GroupIcon,
	ExitToApp as ExitToAppIcon,
	DescriptionOutlined,
} from "@mui/icons-material";
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
import { useAuth } from "../Context";
import { Button, IconButton } from "@mui/material";

export default function Sidebar() {
	const [open, setOpen] = useState(false);
	const { user } = useAuth();
	const location = useLocation();

	const handleLogout = async () => {
		setOpen(false);
		try {
			await logout();
			window.location.href = "/";
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	const menuItems = [
		{ text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
		{ text: "Records", path: "/tables", icon: <TableChartIcon /> },
		{
			text: "Add Records",
			path: "/addrecords",
			icon: <img src="note.svg" alt="add record" />,
		},
		{
			text: "GFPS Corner",
			path: "/documentation",
			icon: <img src="image.svg" alt="GFPS Corner" />,
		},
		{
			text: "Logs",
			path: "/logs",
			icon: <DescriptionOutlined />,
		},
		{ text: "User Management", path: "/users", icon: <GroupIcon /> },
	];

	const DrawerContent = (
		<SidebarContainer anchor="left" variant="permanent">
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
									border: "1px solid transparent",
									backgroundColor:
										location.pathname === item.path ? "#fbaaff" : "transparent",
									"&:hover": {
										backgroundColor:
											location.pathname === item.path
												? "#fbaaff"
												: "transparent",
										border: "1px solid #fbaaff",
									},
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
			{/* ✅ Toggle button for small screens */}
			<Box
				sx={{
					display: { sm: "block", md: "none" },
					position: "fixed",
					bottom: 10,
					right: 10,
					zIndex: 1300,
				}}
			>
				<IconButton
					onClick={() => setOpen((prev) => !prev)}
					variant="contained"
					sx={{
						height: "3rem",
						width: "3rem",
						color: "white",
						backgroundColor: "var(--eminence)",
						"&:hover": {
							backgroundColor: "var(--orange)",
						},
					}}
				>
					<MenuIcon />
				</IconButton>
			</Box>

			{/* ✅ Desktop Sidebar */}
			<Box
				sx={{
					display: { xs: "none", sm: "none", md: "block" },
					width: "250px",
				}}
			>
				{DrawerContent}
			</Box>

			{/* ✅ Mobile Drawer Sidebar */}
			<Drawer
				anchor="left"
				open={open}
				onClose={() => setOpen(false)}
				sx={{
					"& .MuiDrawer-paper": {
						backgroundColor: "transparent",
						color: "white",
						width: "250px",
					},
				}}
			>
				{DrawerContent}
			</Drawer>
		</>
	);
}
