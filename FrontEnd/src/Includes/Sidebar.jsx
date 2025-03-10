import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
	Box,
	Drawer,
	Button,
	List,
	Divider,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";

export default function Sidebar() {
	const [open, setOpen] = React.useState(false);
	const location = useLocation(); // Get the current path

	const menuItems = [
		{ text: "Dashboard", path: "/", icon: <DashboardIcon /> },
		{ text: "Manage Forms", path: "/ManageForms", icon: <DescriptionIcon /> },
	];

	// Toggle Drawer
	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	// Sidebar Drawer Content
	const DrawerList = (
		<Box
			sx={{
				width: 250,
				background: "#5D3786",
				height: "100vh",
				color: "white",
			}}
			role="presentation"
			onClick={toggleDrawer(false)}
		>
			<Typography
				variant="h6"
				sx={{
					color: "#ff7706",
					padding: "20px",
					fontWeight: "bold",
				}}
			>
				Admin Panel
			</Typography>
			<Divider sx={{ backgroundColor: "white" }} />
			<List>
				{menuItems.map((item) => (
					<ListItem key={item.path} disablePadding>
						<ListItemButton
							component={Link}
							to={item.path}
							sx={{
								backgroundColor:
									location.pathname === item.path ? "#ff7706" : "transparent",
								"&:hover": { backgroundColor: "#ff7706" },
								borderRadius: "5px",
								margin: "5px",
							}}
						>
							<ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
							<ListItemText
								primary={item.text}
								sx={{
									color: "white",
									fontWeight:
										location.pathname === item.path ? "bold" : "normal",
								}}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<>
			{/* AppBar for Mobile Menu Button */}
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
					display: { sm: "none" }, // Hide on larger screens
				}}
			>
				<MenuIcon />
			</IconButton>

			{/* Sidebar for Larger Screens */}
			<Box
				sx={{
					display: { xs: "none", sm: "block" }, // Hide on small screens
					width: "250px",
					background: "#5D3786",
					height: "100vh",
					color: "white",
				}}
			>
				{DrawerList}
			</Box>

			{/* Mobile Drawer */}
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</>
	);
}
