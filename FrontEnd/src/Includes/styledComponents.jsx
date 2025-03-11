import { styled } from "@mui/material/styles";
import { Box, Typography, Button, IconButton } from "@mui/material";

// Sidebar & Navigation Container
export const NavContainer = styled(Box)({
	minWidth: "1200px",
	maxWidth: "2600px",
	width: "100%",
	margin: "0 auto",
	display: "flex",
});

export const SidebarContainer = styled(Box)({
	flexShrink: 0,
	width: "270px",
	padding: "25px 25px 25px 5px",
	display: "flex",
	flexDirection: "column",
	backgroundColor: "var(--white)",
	boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",

	// Hide on mobile
	"@media (max-width: 1024px)": {
		position: "fixed",
		left: "-100%",
		height: "100vh",
		transition: "all 0.3s ease",
		zIndex: 1000,
		"&.open": {
			left: "0",
		},
	},
});

// Mobile Menu Button (Hamburger Icon)
export const MobileMenuButton = styled(IconButton)({
	display: "none",

	"@media (max-width: 1024px)": {
		display: "block",
		position: "absolute",
		top: "15px",
		left: "15px",
		backgroundColor: "var(--green)",
		color: "white",
		"&:hover": {
			backgroundColor: "#008037",
		},
	},
});

// Profile Section
export const NavProfile = styled(Box)({
	width: "calc(100% - (25px - 5px))",
	margin: "25px 0",
	padding: "10px",
	borderRadius: "8px",
	display: "flex",
	alignItems: "center",
	gap: "10px",
	boxShadow:
		"rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
});

// Sidebar Items Container
export const NavItems = styled(Box)({
	paddingRight: "calc(25px - 5px)",
	width: "100%",
	height: "calc(100vh - 314px)",
	overflowY: "auto",
	scrollBehavior: "smooth",
	marginBottom: "25px",
});

// Logout Button
export const LogoutButton = styled(Button)({
	backgroundColor: "var(--orange)",
	color: "white",
	margin: "10px",
	borderRadius: "5px",
	"&:hover": { backgroundColor: "#e06505" },
});
