import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Change this when deploying

const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Ensures cookies (sessions) are sent with requests
});

// ✅ Correctly export the function
export const apiCall = async (method, url, data = null) => {
	try {
		const response = await api({ method, url, data });
		return response.data;
	} catch (error) {
		throw (
			error.response?.data?.error || "Something went wrong. Please try again."
		);
	}
};

// Export other API functions
export const login = (credentials) => apiCall("post", "/login", credentials);
export const logout = () => apiCall("post", "/logout");
export const fetchOrdinances = () => apiCall("get", "/ordinances");
export const fetchOrdinanceById = (id) => apiCall("get", `/ordinances/${id}`);
export const createOrdinance = (formData) =>
	apiCall("post", "/ordinances", formData);
export const deleteOrdinance = (id) => apiCall("delete", `/ordinances/${id}`);
export const updateOrdinanceStatus = (id, status) =>
	apiCall("put", `/ordinances/${id}`, { status });
