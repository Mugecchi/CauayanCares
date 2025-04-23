// main.jsx or App.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Context";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<App />
		</AuthProvider>
	</QueryClientProvider>
);
