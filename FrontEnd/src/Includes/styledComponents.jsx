import styled from "styled-components";
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
} from "@mui/material";

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
  color: #ff7706;
  padding: 25px;
  font-weight: bold;
  font-size: 25px;
  text-align: center;
  margin: 0;
`;
export const SidebarDropdown = styled(Box)`
  display: ${({ isDropdownOpen }) => (isDropdownOpen ? "block" : "none")};
  margin-left: 20px;
  padding-left: 10px;
  border-left: 2px solid rgba(255, 255, 255, 0.3);
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
    font-size: 26px !important; /* Adjust icon size if needed */
  }
`;

export const SidebarButton = styled(ListItemButton)`
  background-color: ${({ active }) => (active ? "#fbaaff" : "transparent")};
  &:hover {
    background-color: #fbaaff;
  }
  border-radius: 5px;
  width: 100%;
  gap: 10px;
  height: auto;
`;

export const SidebarItemText = styled(ListItemText)`
  span {
    color: white !important; /* Ensures text remains white */
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

export const CustomTabs = styled(Tabs)({
  backgroundColor: "#5D3786",
  color: "white",
  borderRadius: "10px 10px 0   0 ",
  "& .MuiTabs-indicator": {
    backgroundColor: "#FF7706",
    height: "4px",
    borderRadius: "5px",
  },
});

export const CustomTab = styled(Tab)({
  color: "white !important",
  textTransform: "none",
  fontWeight: "bold",
  "&.Mui-selected": {
    color: "#FF7706",
  },
});

export const TableContainer2 = styled(TableContainer)({
  minHeight: "70vh",
  minWidth: "100vw",
});
