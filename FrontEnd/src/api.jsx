import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Change this when deploying

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensures cookies (sessions) are sent with requests
});

// Generic function to handle API calls with error handling
const apiCall = async (method, url, data = null) => {
  try {
    const response = await api({ method, url, data });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.error || "Something went wrong. Please try again."
    );
  }
};

// User Authentication
export const login = (credentials) => apiCall("post", "/login", credentials);
export const logout = () => apiCall("post", "/logout");

// Ordinance Management
export const fetchOrdinances = () => apiCall("get", "/ordinances");
export const fetchOrdinanceById = (id) => apiCall("get", `/ordinances/${id}`);
export const createOrdinance = (formData) =>
  apiCall("post", "/ordinances", formData); // ✅ Renamed for clarity
export const deleteOrdinance = (id) => apiCall("delete", `/ordinances/${id}`);
export const updateOrdinanceStatus = (id, status) =>
  apiCall("put", `/ordinances/${id}`, { status });
