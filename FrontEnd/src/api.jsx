import axios from "axios";
const API_BASE_URL =
	import.meta.env.MODE === "development"
		? "http://localhost:5000/api" // Local development
		: `${window.location.origin}/api`; // Automatically use the Railway domain in production

export default API_BASE_URL;

const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Ensures cookies (sessions) are sent with requests
});

// Generic API request function
export const apiCall = async (method, url, data = null, isFormData = false) => {
	try {
		const config = isFormData
			? { headers: { "Content-Type": "multipart/form-data" } }
			: {};

		const response = await api({ method, url, data, ...config });
		return response.data;
	} catch (error) {
		throw (
			error.response?.data?.error || "Something went wrong. Please try again."
		);
	}
};

// Authentication endpoints
export const logout = async () => {
	try {
		await api.post("/logout");
		localStorage.removeItem("userToken");
		localStorage.removeItem("user");
	} catch (error) {
		throw error.response?.data?.error || "Logout failed";
	}
};

// Ordinance CRUD operations
export const fetchOrdinances = () => apiCall("get", "/ordinances");
export const fetchOrdinanceById = (id) => apiCall("get", `/ordinances/${id}`);
export const deleteOrdinance = (id) => apiCall("delete", `/ordinances/${id}`);
export const updateOrdinanceStatus = (id, status) =>
	apiCall("put", `/ordinances/${id}`, { status });

export const fetchOrdinancesCoverage = () =>
	apiCall("get", "/ordinancesCoverage");

export const fetchMonitoring = () => apiCall("get", "/monitoring");
export const fetchIassesment = () => apiCall("get", "/assessment");
export const fetchDocReports = () => apiCall("get", "/monitoring");

export const createOrdinance = (formData) =>
	apiCall("post", "/ordinances", formData);
export const addObjectiveImplementation = async (formData) => {
	try {
		await api.post("/objectives_implementation", formData);
		return { success: true };
	} catch (error) {
		console.error("Error adding Objective/Implementation:", error);
		throw error;
	}
};
export const fetchDashboardCounts = () => apiCall("get", "/dashboard");
export const fetchUser = async () => {
	return apiCall("get", "/user"); // Assuming "/protected" returns user data if logged in
};
export const login = async (credentials) => {
	try {
		const response = await api.post("/login", credentials);
		localStorage.setItem("userToken", response.data.token); // Store token
		return response.data; // Return the response to handle success in Login.jsx
	} catch (error) {
		throw error.response?.data?.error || "Login failed";
	}
};

export const fetchFinancialData = () => apiCall("get", "/financial");

export const handlePreview = (filePath, setSelectedFile, setOpenPreview) => {
	// Dynamically build the file preview URL based on the environment
	const previewUrl = `${API_BASE_URL.replace("/api", "")}/uploads/${filePath}`;
	setSelectedFile(previewUrl); // Set the preview URL to be displayed
	setOpenPreview(true); // Open the preview modal
};

export const addCoverageScope = (data) =>
	apiCall("post", "/coverage_scope", data);
export const updateCoverageScope = (id, data) =>
	apiCall("put", `/coverage_scope/${id}`, data);
export const deleteCoverageScope = (id) =>
	apiCall("delete", `/coverage_scope/${id}`);
