import styled, { createGlobalStyle } from "styled-components";
import {
	Box,
	Button,
	ListItemButton,
	List,
	ListItemIcon,
	ListItemText,
	ListItem,
	Tabs,
	Tab,
	createTheme,
	ThemeProvider,
	Accordion,
} from "@mui/material";

/* ✅ Inject Global CSS Variables */
const GlobalStyles = createGlobalStyle`
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
	}

	#root {
		margin: 0 auto;
		min-width: 1200px;
		max-width: 2600px;
		width: 100%;    
	}
`;

/* ✅ MUI Theme */
const theme = createTheme({
	components: {
		Muitr: {
			styleOverrides: {
				root: {
					padding: 0,
					margin: 0,
					height: "5vh", // Adjust row height dynamically
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					"&:not(:has(th)):nth-of-type(odd)": {
						backgroundColor: "var(--alice-blue)", // Light blue for odd rows
					},
					"&:not(:has(th)):nth-of-type(even)": {
						backgroundColor: "#F5F5F5", // Light gray for even rows
					},
				},
			},
		},

		Muitd: {
			styleOverrides: {
				root: {
					padding: "8px", // Adjust padding to reduce extra space
					fontSize: "14px", // Set consistent font size
					lineHeight: "20px", // Control text height
					borderBottom: "1px solid rgba(0, 0, 0, 0.12)", // Add subtle border
				},
				head: {
					fontWeight: "bold", // Make header text bold
				},
				body: {
					height: "85px",
				},
			},
		},

		MuiInputBase: {
			styleOverrides: {
				root: {
					height: "44px",
					fontSize: "16px",
				},
			},
		},

		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "var(--eminence) !important", // Change label color
					fontSize: "16px", // Adjust font size
					fontWeight: "bold", // Make text bold
					"&.Mui-focused": {
						color: "var(--orange) !important", // Use `--orange` if `--eminence` is undefined
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					height: "3rem", // Set height globally for all buttons
					backgroundColor: "var(--eminence)", // Use the --eminence color globally
					color: "var(--white)",
					"&:hover": {
						backgroundColor: "var(--orange)",
						// Maintain background color on hover
					},
				},
				outlined: {
					borderColor: "transparent",
					backgroundColor: "var(--orange)", // Set the border color for outlined buttons
					color: "var(--white)", // Set the text color for outlined buttons
					"&:hover": {
						backgroundColor: "var(--white)",
						borderColor: "var(--eminence)", // Change border color on hover
						color: "var(--eminence)", // Change text color on hover
					},
				},
			},
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {
					overflowY: "auto", // Enable vertical scrolling
					maxHeight: "calc(70vh - 15px)", // Set the max height to 70% of the viewport height
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
	padding: 16,
	position: "absolute",
	height: "calc(90vh - 20px)",
	width: "calc(100vw - 290px)",
	maxHeight: 1080,
	minWidth: "280px",
	maxWidth: 2600,
	display: "flex",
	flexDirection: "column",
	background: "white",
	borderRadius: 10,
	...(sx || {}), // Allow external sx props to override styles
}));

export const CustomAccordion = styled(Accordion)({
	borderRadius: "10px",
});

// Sidebar Container

export const SidebarContainer = styled(Box)`
	position: fixed;
	left: 0;
	top: 0;
	width: 250px;
	height: 100vh;
	background: #5d3786;
	color: white;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 25px;
	z-index: 1000; /* Ensures it's above other content */
	box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
`;

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
	&:hover {
		border: 1px solid #fbaaff;
	}
	border-radius: 5px;
	width: 100%;
	gap: 10px;
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
