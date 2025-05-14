import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],

	server: {
		historyApiFallback: true,
		host: "0.0.0.0", // Bind to all network interfaces
		port: 5173, // Or any port you like
	},
});
