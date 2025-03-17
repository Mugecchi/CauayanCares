import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api"; // ✅ Import logout function
import {
	Box,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
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
	const [open, setOpen] = React.useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = React.useState({});

	// Toggle dropdown
	const toggleDropdown = (item) => {
		setDropdownOpen((prev) => ({
			...prev,
			[item]: !prev[item],
		}));
	};

	// Sidebar menu items
	const menuItems = [
		{ text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
		{
			text: "View Forms",
			icon: <DescriptionIcon />,
			dropdown: [
				{ text: "View Tables", path: "/tables" },
				{ text: "Add Record", path: "/forms" },
			],
		},
	];

	// Toggle Drawer
	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	// ✅ Handle logout using API function
	const handleLogout = async () => {
		setOpen(false);
		try {
			await logout(); // ✅ Use the logout function from api.jsx
			setTimeout(() => {
				window.location.href = "/"; // Ensure redirect happens
			}, 100);
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	// Sidebar Drawer Content
	const DrawerList = (
		<SidebarContainer>
			<Box>
				<SidebarTitle>CAUAYAN CARES </SidebarTitle>
				<SidebarList>
					{menuItems.map((item) => (
						<React.Fragment key={item.text}>
							<SidebarItem disablePadding sx={{ marginBottom: "10px" }}>
								<SidebarButton
									component={item.dropdown ? "button" : Link}
									to={item.dropdown ? undefined : item.path}
									onClick={
										item.dropdown
											? () => toggleDropdown(item.text)
											: toggleDrawer(false)
									}
									sx={{
										backgroundColor:
											location.pathname === item.path
												? "#fbaaff"
												: "transparent",
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
									{item.dropdown &&
										(dropdownOpen[item.text] ? <ExpandLess /> : <ExpandMore />)}
								</SidebarButton>
							</SidebarItem>

							{item.dropdown && (
								<Collapse
									in={dropdownOpen[item.text]}
									timeout="auto"
									unmountOnExit
								>
									<List>
										{item.dropdown.map((subItem) => (
											<ListItemButton
												key={subItem.text}
												component={Link}
												to={subItem.path}
												onClick={toggleDrawer(false)}
												sx={{
													backgroundColor:
														location.pathname === subItem.path
															? "#fbaaff"
															: "transparent",
													"&:hover": { backgroundColor: "#fbaaff" },
													borderRadius: "5px",
													width: "100%",
													paddingLeft: "53px",
													color: "white",
												}}
											>
												<SidebarItemText
													primary={subItem.text}
													sx={{ color: "white" }}
												/>
											</ListItemButton>
										))}
									</List>
								</Collapse>
							)}
						</React.Fragment>
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
				onClick={toggleDrawer(true)}
				sx={{
					bottom: "20px",
					left: "20px",
					position: "fixed",
					zIndex: 100,
					backgroundColor: "#5D3786",
					color: "white",
					borderRadius: "50%",
					width: "50px",
					height: "50px",
					boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
					"&:hover": { backgroundColor: "#ff7706", color: "white" },
					display: { sm: "none" },
				}}
			>
				<MenuIcon />
			</IconButton>

			{/* Desktop Sidebar */}
			<Box sx={{ display: { xs: "none", sm: "block" }, width: "250px" }}>
				{DrawerList}
			</Box>

			{/* Mobile Sidebar Drawer */}
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</>
	);
}
