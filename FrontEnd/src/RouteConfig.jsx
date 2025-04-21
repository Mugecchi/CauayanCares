// routeConfig.js
import AddRecord from "./Pages/AddRecord";
import Dashboard from "./Pages/Dashboard";
import Tables from "./Pages/Tables";
import DocumentationReps from "./Components/DocumentationReps";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";

export const routeConfig = [
	{
		path: "/",
		element: <Dashboard />,
		protected: true,
		role: null, // No specific role needed
	},
	{
		path: "/addrecords",
		element: <AddRecord />,
		protected: true,
		role: null, // No specific role needed
	},
	{
		path: "/dashboard",
		element: <Dashboard />,
		protected: true,
		role: null,
	},
	{
		path: "/tables",
		element: <Tables />,
		protected: true,
		role: null,
	},
	{
		path: "/documentation",
		element: <DocumentationReps />,
		protected: true,
		role: null,
	},
	{
		path: "/users",
		element: <Registration />,
		protected: true,
		role: "admin", // Only admins can access this route
	},
	{
		path: "/login",
		element: <Login />,
		protected: false,
		role: null, // No role check for login
	},
];
