import styled, { createGlobalStyle } from "styled-components";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import Drawer from "@mui/material/Drawer";
import { createTheme, ThemeProvider } from "@mui/material";
/* ✅ Inject Global CSS Variables */
export const GlobalStyles = createGlobalStyle`
	:root {
		--anti-flash-white: #F0F0F0;
		--alice-blue: #EEF7FF;
		--bright-gray: #E9E9E9;
		--chinese-white: #e0e0e0;
		--dark-silver: #737070;
		--gainsboro: #DEDEDE;
		--gray: #BBBBBB;
		--green: #00A74C;
		--onyx: #35353A;
		--orange: #FF7A2F;
		--silver-chalice: #ACABAB;
		--white: #FFFFFF;
		--eminence: #69247C;
    --background-color: #f2e6fe;
    
    color-scheme: light dark;
    color: var(--text-color);
    background-color: var(--background-color);
    
    font-family: "SF Pro Display", sans-serif;
  }

  *, *::before, *::after {
    box-sizing: border-box;

    margin: 0;
    padding: 0;
  }

 
  body {
    font-size: 16px;
    line-height: 1.6;
  }

`;

/* ✅ MUI Theme */
const theme = createTheme({
	components: {
		// ✅ Table Container (Ensures Responsiveness & Auto-Fit)
		MuiTableContainer: {
			styleOverrides: {
				root: {
					display: "flex",
					flexDirection: "column",
					flexGrow: 1, // Ensures it fills the available space
					overflow: "auto", // Enables scrolling when needed
					maxHeight: "calc(70vh - 20px)", // Limits height to 70% of viewport height
					width: "100%",
				},
			},
		},

		// ✅ Table Itself (Ensures Full Width & Auto-Adjust)
		MuiTable: {
			styleOverrides: {
				root: {
					width: "100%", // Always stretch to fill container
					tableLayout: "fixed", // Consistent column sizing
					minWidth: "600px", // Prevents too small tables on narrow screens
				},
			},
		},

		// ✅ Table Row (Ensures Consistent Row Heights & Alternating Colors)
		MuiTableRow: {
			styleOverrides: {
				root: {
					height: "4rem", // Adjust row height dynamically

					// Apply alternating colors **ONLY to body rows**
					"&:not(:has(th)):nth-of-type(odd)": {
						backgroundColor: "rgba(255, 123, 47, 0.02)", // Light blue for odd rows
					},
					"&:not(:has(th)):nth-of-type(even)": {
						backgroundColor: "rgba(105, 36, 124, 0.05)", // Light gray for even rows
					},

					"&:last-child td, &:last-child th": {
						borderBottom: "none", // Remove bottom border for the last row
					},
				},
			},
		},

		// ✅ Table Cells (Handles Padding & Font Styling)
		MuiTableCell: {
			styleOverrides: {
				root: {
					color: "#41444B",
					padding: "8px",
					fontSize: "14px",
					overflow: "hidden", // Hide overflowing text
					textOverflow: "ellipsis", // Show "..." for overflow
				},
				"&:hover": {
					whiteSpace: "normal", // Allow wrapping
					overflow: "visible",
					textOverflow: "unset",
					maxWidth: "none", // Expand to full width
					backgroundColor: "rgba(0,0,0,0.05)", // Light hover effect
					zIndex: 10, // Ensure it overlays other cells
					position: "relative",
				},
				head: {
					fontWeight: "bold", // Make header text bold
				},
				body: {
					height: "85px",
					textAlign: "left",
				},
			},
		},

		// ✅ Table Pagination (Ensures Proper Placement & Styling)

		// ✅ Input Fields (Ensures Consistent Height & Font Styling)
		MuiInputBase: {
			styleOverrides: {
				root: {
					height: "44px",
					fontSize: "16px",
				},
			},
		},

		// ✅ Input Labels (Ensures Readability & Focus Effect)
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "var(--eminence) !important",
					fontSize: "16px",
					fontWeight: "bold",
					"&.Mui-focused": {
						color: "var(--orange) !important",
					},
				},
			},
		},

		// ✅ Buttons (Ensures Consistent Sizing & Styling)
		MuiButton: {
			styleOverrides: {
				root: {
					height: "3rem",
					backgroundColor: "var(--eminence)",
					color: "var(--white)",
					"&:hover": {
						backgroundColor: "var(--orange)",
					},
				},
				outlined: {
					borderColor: "transparent",
					backgroundColor: "var(--orange)",
					color: "var(--white)",
					"&:hover": {
						backgroundColor: "var(--white)",
						borderColor: "var(--eminence)",
						color: "var(--eminence)",
					},
				},
			},
		},
	},
});

/* ✅ Theme Provider Component */
export const ThemeProv = ({ children }) => (
	<>
		<GlobalStyles />
		<ThemeProvider theme={theme}>{children}</ThemeProvider>
	</>
);

/* ✅ Styled Components */
export const WhiteBox = styled(Box)(({ theme, sx }) => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start", // Align content at the top
	alignItems: "center", // Center children horizontally
	padding: 16,
	gap: 16, // Adds spacing between child elements
	position: "relative",
	width: "100%", // Make it fluid inside Grid2
	minHeight: "calc(90vh - 30px)", // Ensures it stretches properly
	background: "white",
	borderRadius: 10,
	boxShadow: 3, // Adds a subtle shadow for better UI depth

	...(sx || {}), // Allow external sx props to override styles
}));

export const CustomAccordion = styled(Accordion)({
	borderRadius: "10px",
});

// Sidebar Container
export const ContentContainer = styled(Box)`
	width: calc(100%); /* Ensures it takes the remaining space */
	transition: margin-left 0.3s ease-in-out;
	@media (max-width: 768px) {
		margin-left: 0; /* Full width on small screens */
		width: 100%;
	}
`;

export const SidebarContainer = styled(Drawer)(({ theme }) => ({
	"& .MuiDrawer-paper": {
		width: 250,
		height: "100%",
		background: "#5d3786",
		color: "white",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		padding: 25,
		zIndex: 1000,
		boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
	},
}));

// Sidebar Title
export const SidebarTitle = styled.h6`
	color: #ff7706 !important; /* Ensures it stays orange */
	padding: 25px;
	font-weight: bold;
	font-size: 25px;
	text-align: center;
	margin: 0;
`;

// Sidebar Dropdown
export const SidebarDropdown = styled(Box)`
	display: ${({ isDropdownOpen }) => (isDropdownOpen ? "block" : "none")};
`;

// Sidebar List
export const SidebarList = styled(List)`
	padding: 0;
`;

export const SidebarItem = styled(ListItem)`
	margin-bottom: 10px;
`;

export const SidebarItemIcon = styled(ListItemIcon)`
	color: white !important;
	min-width: 26px !important;

	& svg {
		color: white !important;
		font-size: 26px !important;
	}
`;

export const SidebarButton = styled(ListItemButton)`
	height: auto;
`;

export const SidebarItemText = styled(ListItemText)`
	span {
		color: white !important;
		font-weight: ${({ active }) => (active ? "bold" : "normal")};
		padding: 0 !important;
	}
`;

// Sidebar Logout Button
export const LogoutButton = styled(Button)`
	background-color: transparent;
	color: white;
	margin: 10px;
	&:hover {
		background-color: #e06505;
	}
`;

// Example of a reusable container
export const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
`;

// Example of a reusable input field
export const Input = styled.input`
	width: 100%;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-radius: 5px;
	font-size: 1rem;
`;
export const CustomTabs = styled(Tabs)`
	background-color: var(--white);
	border-radius: 10px 10px 0 0;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	overflow-x: auto;
	& .MuiTabs-indicator {
		background-color: var(--eminence) !important;
		height: 4px;
		border-radius: 5px;
	}
`;

export const CustomHead = styled(Box)({
	height: "100px",
	backgroundColor: "black",
});

export const CustomTab = styled(Tab)`
	color: var(--eminence) !important;
	text-transform: none;
	font-weight: bold;
	&.Mui-selected {
		color: var(--white) !important;
		background-color: var(--eminence);
	}
`;
