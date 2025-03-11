import axios from "axios";

// Create an Axios instance
const api = axios.create({
	baseURL: "http://localhost:5000/api",
	withCredentials: true, // Include cookies for authentication
});

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Unauthorized: Redirect to login
			localStorage.removeItem("userToken"); // Clear session
			localStorage.removeItem("user");
			window.location.href = "/"; // Redirect to login page
		}
		return Promise.reject(error);
	}
);

export default api;
