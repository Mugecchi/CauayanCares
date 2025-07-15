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
import { motion } from "framer-motion";

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
		--background-color: radial-gradient(circle at 30% 30%, #5D378C 0%, transparent 100%),radial-gradient(circle at 70% 70%, #FF7704 0%, transparent 100%);
		--border: 240 3.7% 15.9%;
		color-scheme: dark;
		color: var(--text-color);
		background: var(--background-color);
		font-family: Poppins;
		background-repeat: no-repeat;
  }

  *, *::before, *::after {
    box-sizing: border-box;
	border-color: hsl(var(--border));
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--border)) transparent;
    margin: 0;
    padding: 0;
  }
  body {
    font-size: 16px;
    line-height: 1.6;
  }
@keyframes skeleton {
    0% {
        background-position: -100% 0;
    }
    100% {
        background-position: 100% 0;
    }
}
`;

/* ✅ MUI Theme */
const theme = createTheme({
	typography: {
		fontFamily: "Poppins",
	},
	components: {
		MuiTablePagination: {
			styleOverrides: {
				root: {
					color: "#fff", // Text color
				},
			},
		},

		// ✅ Form Control (Input containers with Glassmorphism)
		MuiFormControl: {
			styleOverrides: {
				root: {
					color: "#fff", // Text color
					backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
					backdropFilter: "blur(10px)", // Main blur effect
					WebkitBackdropFilter: "blur(10px)", // Safari support
					borderRadius: "8px", // Rounded corners
					padding: "8px", // Padding for spacing
				},
			},
		},

		// ✅ TextField (Styled Input Fields with Glassmorphism)
		MuiTextField: {
			styleOverrides: {
				root: {
					textShadow: "0 1px 2px rgba(13, 12, 12, 0.94)", // Text shadow for better readability
					color: "#fff", // Text color
					backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
					backdropFilter: "blur(10px)", // Main blur effect
					WebkitBackdropFilter: "blur(10px)", // Safari support
					borderRadius: "8px", // Rounded corners
				},
			},
		},

		// ✅ Outlined Input (For input fields with outlines)
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					textShadow: "0 1px 2px rgba(13, 12, 12, 0.94)", // Text shadow for input text
					color: "#fff", // Text color
					backgroundColor: "transparent", // Transparent background
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "rgba(255, 255, 255, 0.6)", // Brighter outline on focus
					},
					"& input": {
						textShadow: "0 1px 2px rgba(13, 12, 12, 0.94)", // Text shadow for the input text
					},
				},
				notchedOutline: {
					borderColor: "rgba(255, 255, 255, 0.3)", // Default (unfocused)
				},
			},
		},

		// ✅ Table Container (Ensures Responsiveness & Glass Effect)
		MuiTableContainer: {
			styleOverrides: {
				root: {
					display: "flex",
					flexDirection: "column",
					flexGrow: 1, // Ensures it fills the available space
					overflowY: "scroll", // Enables scrolling when needed
					maxHeight: "calc(70vh - 50px)", // Limits height to 70% of viewport height
					width: "100%",
					background: "rgba(93, 55, 134, 0.2)", // Light glass effect
					borderRadius: 10, // Rounded corners
				},
			},
		},

		// ✅ Table (Full Width and Glassmorphism)
		MuiTable: {
			styleOverrides: {
				root: {
					width: "100%", // Always stretch to fill container
					minWidth: "600px", // Prevents too small tables on narrow screens
					background: "rgba(93, 55, 134, 0.1)", // Subtle glassmorphism effect
					backdropFilter: "blur(6px)", // Mild blur effect
					borderRadius: 10, // Rounded corners
					tableLayout: "auto",
				},
			},
		},

		// ✅ Table Row (Consistent Row Heights & Alternating Colors)
		MuiTableRow: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(93, 55, 134, 0.1)", // Light glass effect for rows
					backdropFilter: "blur(5px)", // Subtle blur effect for rows
					"&:not(:has(th)):nth-of-type(odd)": {
						backgroundColor: "rgba(255, 94, 0, 0.05)", // Light orange for odd rows
						border: "1px solid rgba(255, 255, 255, 0.2)",
					},
					"&:not(:has(th)):nth-of-type(even)": {
						backgroundColor: "rgba(105, 36, 124, 0.05)", // Light gray for even rows
						border: "1px solid rgba(255, 255, 255, 0.2)",
					},
					"&:last-child td, &:last-child th": {
						border: "none", // Remove bottom border for the last row
					},
				},
			},
		},

		// ✅ Table Cells (Padding, Font Styling & Glass Effect)
		MuiTableCell: {
			styleOverrides: {
				root: {
					border: "none", // Remove bottom border for the last row
					color: "#fff", // Text color
					padding: "8px",
					fontSize: "14px",
					background: "rgba(93, 55, 134, 0.1)", // Glass effect for cell background
					backdropFilter: "blur(5px)", // Slight blur effect
					position: "relative", // For hover effect
					"&:hover": {
						background: "rgba(0, 0, 0, 0.1)", // Light hover effect
						zIndex: 10, // Ensure it overlays other cells
						position: "relative",
					},
				},

				head: {
					fontWeight: "bold", // Bold header text
				},
				body: {
					textAlign: "left",
					maxWidth: "200px", // Limit width for body cells
				},
			},
		},

		// ✅ Input Base (Consistent Height & Font Styling)
		MuiInputBase: {
			styleOverrides: {
				root: {
					textShadow: "0 1px 2px rgba(13, 12, 12, 0.94)", // Text shadow
					height: "44px",
					fontSize: "16px",
				},
			},
		},

		// ✅ Input Labels (Readability & Focus Effect)
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "var(--eminence) !important",
					fontSize: "16px",
					fontWeight: "bold",
					"&.Mui-focused": {
						color: "var(--orange) !important", // Focus color
					},
				},
			},
		},
		MuiButton: {
			defaultProps: {
				component: motion.button, // Use framer-motion's button as the default button
				initial: { opacity: 0, scale: 0.8 },
				animate: { opacity: 1, scale: 1 },
				whileHover: { scale: 1.1 }, // Hover animation
				whileTap: { scale: 0.95 }, // Tap animation
				transition: { duration: 0.5 },
			},
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
		MuiDialog: {
			styleOverrides: {
				paper: {
					width: "100%",
					maxWidth: "45vw",
					backgroundColor: "rgba(255, 255, 255, 0.15)",
					backdropFilter: "blur(10px)",
					boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
					borderRadius: 20,
					border: "1px solid rgba(255, 255, 255, 0.18)",
				},
			},
		},
		MuiDialogContent: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(255, 255, 255, 0.05)",
					backdropFilter: "blur(8px)",
					padding: "16px 24px",
				},
			},
		},
		MuiDialogActions: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(255, 255, 255, 0.05)",
					backdropFilter: "blur(8px)",
					padding: "8px 24px",
					borderTop: "1px solid rgba(255, 255, 255, 0.1)",
				},
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: {
					color: "white",
					backgroundColor: "rgba(255, 255, 255, 0.05)",
					backdropFilter: "blur(8px)",
					padding: "8px 24px",
					borderTop: "1px solid rgba(255, 255, 255, 0.1)",
				},
			},
		},

		MuiBackdrop: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(0, 0, 0, 0.4)",
					backdropFilter: "blur(10px)",
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
	overflow: "hidden",
	flexDirection: "column",
	justifyContent: "flex-start", // Align content at the top
	alignItems: "stretch", // Center children horizontally
	padding: `16px 16px 0 16px`,
	gap: 16, // Adds spacing between child elements
	position: "relative",
	width: "100%", // Make it fluid inside Grid2
	minHeight: "calc(90vh - 30px)", // Ensures it stretches properly
	background: "white",
	borderRadius: 10,
	backdropFilter: "blur(10px)", // 100px is extreme and often ineffective
	WebkitBackdropFilter: "blur(10px)", // Safari support
	backgroundColor: "rgba(255, 255, 255, 0.28)", // Add transparency
	boxShadow: 3, // Adds a subtle shadow for better UI depth

	...(sx || {}), // Allow external sx props to override styles
}));
export const CustomAccordion = styled(Accordion)({
	borderRadius: "10px",
});

// Sidebar Container
export const ContentContainer = styled(Box)(({ theme }) => ({
	width: "100%",
	transition: "margin-left 0.3s ease-in-out",
	md: {
		marginLeft: 0,
		width: "100%",
	},
}));
export const SidebarContainer = styled(Drawer)(({ theme }) => ({
	"& .MuiDrawer-paper": {
		width: 250,
		height: "100%",

		background:
			"linear-gradient(to bottom, rgba(93, 55, 134, 0.3), rgba(93, 55, 134, 0.7))", // gradient with slight transparency
		backdropFilter: "blur(10px)", // blur effect for glassmorphism
		color: "white",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		padding: 25,
		zIndex: 1000,
		boxShadow: "2px 0 10px rgba(0, 0, 0, 0.3)", // darker shadow for better separation
		borderRadius: "0 20px 20px  0  ", // optional rounded corners
	},
}));

// Sidebar Title
export const SidebarTitle = styled("h6")`
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
	backdrop-filter: blur(5px); /* Adding blur to dropdown for glass effect */
`;

// Sidebar List
export const SidebarList = styled(List)`
	padding: 0;
`;

// Sidebar Item
export const SidebarItem = styled(ListItem)`
	margin-bottom: 10px;
`;

// Sidebar Item Icon
export const SidebarItemIcon = styled(ListItemIcon)`
	color: white !important;
	min-width: 26px !important;

	& svg {
		color: white !important;
		font-size: 26px !important;
	}
`;

// Sidebar Button
export const SidebarButton = styled(ListItemButton)`
	height: auto;
`;

// Sidebar Item Text
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
	border-radius: 10px 10px 0 0;
	backdropfilter: blur(10px);
	webkitbackdropfilter: blur(10px);
	backgroundcolor: rgba(255, 255, 255, 0.22);
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
	color: var(--white) !important;
	text-transform: none;
	font-weight: bold;
	&.Mui-selected {
		color: var(--white) !important;
		background-color: var(--eminence);
	}
`;
