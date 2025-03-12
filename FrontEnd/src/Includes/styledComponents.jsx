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
	TableContainer,
	TableRow,
	createTheme,
	ThemeProvider,
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
`;

/* ✅ MUI Theme */
const theme = createTheme({
	components: {
		MuiTableRow: {
			styleOverrides: {
				root: {
					padding: 0,
					margin: 0,
					height: "5vh", // Adjust row height dynamically
				},
			},
		},

		MuiTableCell: {
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
		MuiTableContainer: {
			styleOverrides: {
				root: {},
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
export const WhiteBox = styled(Box)`
	padding: 16px;
	height: calc(80vh - 10px);
	display: flex;
	flex-direction: column;
	background: white;
	border-radius: 10px;
`;

// Sidebar Container
export const SidebarContainer = styled(Box)`
	width: 250px;
	background: #5d3786;
	padding: 25px;
	height: 100vh;
	color: white;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
	padding: 20px;
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
