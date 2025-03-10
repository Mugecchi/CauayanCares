import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios here
import {
	Box,
	Drawer,
	List,
	Divider,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	IconButton,
	Typography,
	Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function Sidebar() {
	const [open, setOpen] = React.useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const menuItems = [
		{ text: "Dashboard", path: "/Dashboard", icon: <DashboardIcon /> },
		{ text: "Manage Forms", path: "/ManageForms", icon: <DescriptionIcon /> },
	];

	// Toggle Drawer
	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	const handleLogout = async () => {
		setOpen(false); // Close the sidebar
		try {
			// Get the token from localStorage (or wherever you're storing it)
			const token = localStorage.getItem("userToken");

			// If token exists, add it to the request header
			const response = await axios.post(
				"http://localhost:5000/api/logout",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Send token in header
					},
					withCredentials: true, // In case you're using cookies for session management
				}
			);

			if (response.status === 200) {
				// Successfully logged out on the server, clear local storage
				localStorage.removeItem("userToken"); // Remove token from local storage
				localStorage.removeItem("user"); // Clear user session
				navigate("/"); // Redirect to login page
				window.location.reload(); // Refresh the page
			} else {
				throw new Error("Failed to log out on the server.");
			}
		} catch (error) {
			console.error("Error during logout:", error);
			// Optionally, display an error message to the user
		}
	};

	// Sidebar Drawer Content
	const DrawerList = (
		<Box
			sx={{
				width: 250,
				background: "#5D3786",
				height: "100vh",
				color: "white",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
			role="presentation"
			onClick={toggleDrawer(false)}
		>
			<div>
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
			</div>
			{/* Logout Button */}
			<Button
				onClick={handleLogout}
				variant="contained"
				sx={{
					backgroundColor: "#ff7706",
					color: "white",
					margin: "10px",
					borderRadius: "5px",
					"&:hover": { backgroundColor: "#e06505" },
				}}
				startIcon={<ExitToAppIcon />}
			>
				Logout
			</Button>
		</Box>
	);

	return (
		<>
			{/* Mobile Menu Button */}
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

			{/* Sidebar for Larger Screens */}
			<Box sx={{ display: { xs: "none", sm: "block" }, width: "250px" }}>
				{DrawerList}
			</Box>

			{/* Mobile Drawer */}
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</>
	);
}
