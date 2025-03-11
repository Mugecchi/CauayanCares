import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import {
	Box,
	Drawer,
	List,
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
		{
			text: "Dashboard",
			path: "/Dashboard",
			icon: <DashboardIcon sx={{ fontSize: 26 }} />,
		},
		{ text: "View Forms", path: "/ViewForms", icon: <DescriptionIcon /> },
		{ text: "LSA", path: "/", icon: "" },
	];

	// Toggle Drawer
	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	const handleLogout = async () => {
		setOpen(false); // Close the sidebar
		try {
			const token = localStorage.getItem("userToken");

			if (!token) {
				console.warn("No token found, already logged out.");
				navigate("/");
				return;
			}

			// Logout request
			const response = await axios.post(
				"http://localhost:5000/api/logout",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Send token in header
					},
					withCredentials: true, // In case you're using cookies
				}
			);

			if (response.status === 200) {
				// Clear session
				localStorage.removeItem("userToken");
				localStorage.removeItem("user");
				navigate(0); // Refresh the app (or use navigate("/"))
			} else {
				throw new Error("Failed to log out on the server.");
			}
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	// Sidebar Drawer Content
	const DrawerList = (
		<Box
			sx={{
				width: 250,
				background: "#5D3786",
				padding: "25px",
				height: "100vh",
				color: "white",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
			role="presentation"
		>
			<Box>
				<Typography
					variant="h6"
					sx={{
						color: "#ff7706",
						padding: "25px",
						fontWeight: "bold",
						fontSize: "25px",
						textAlign: "center",
					}}
				>
					CAUAYAN CARES{" "}
				</Typography>
				<List>
					{menuItems.map((item) => (
						<ListItem
							disablePadding
							key={item.path}
							sx={{ marginBottom: "10px" }}
						>
							<ListItemButton
								disablePadding
								component={Link}
								to={item.path}
								onClick={toggleDrawer(false)} // Close only when an item is clicked
								sx={{
									backgroundColor:
										location.pathname === item.path ? "#fbaaff" : "transparent",
									"&:hover": { backgroundColor: "#fbaaff" },
									borderRadius: "5px",
									width: "100%",
									gap: "10px",
									height: "auto",
								}}
							>
								<ListItemIcon
									disablePadding
									sx={{
										color: "white",
										minWidth: "0",
									}}
								>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									disablePadding
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
			{/* Logout Button */}
			<Button
				disablePadding
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
			</Button>
		</Box>
	);

	return (
		<>
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

			<Box sx={{ display: { xs: "none", sm: "block" }, width: "250px" }}>
				{DrawerList}
			</Box>

			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</>
	);
}
