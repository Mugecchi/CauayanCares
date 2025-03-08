import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, Divider } from "@mui/material";

const Sidebar = () => {
	return (
		<div
			style={{
				background: "#5D3786",
				color: "white",
				padding: "20px",
				display: "flex",
				flexDirection: "column",
				textWrap: "nowrap",
				width: "250px", // Set a fixed width
				height: "auto", // Full viewport height
				left: 0,
				top: 0,
				overflowY: "auto", // Allow scrolling if content overflows
			}}
		>
			<h2 style={{ color: "#ff7706" }}>Admin Panel</h2>
			<List>
				<ListItem button component={Link} to="/Dashboard">
					<ListItemText sx={{ color: "white" }} primary="Dashboard" />
				</ListItem>
				<Divider style={{ backgroundColor: "white" }} />
				<ListItem button component={Link} to="/">
					<ListItemText sx={{ color: "white" }} primary="Manage Forms" />
				</ListItem>
				<Divider style={{ backgroundColor: "white" }} />
			</List>
		</div>
	);
};

export default Sidebar;
