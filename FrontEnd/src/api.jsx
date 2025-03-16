import axios from "axios";

const API_BASE_URL = "cauayancares-production.up.railway.app/api"; // Change this when deploying

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
export const login = (credentials) => apiCall("post", "/login", credentials);
export const logout = () => apiCall("post", "/logout");

// Ordinance CRUD operations
export const fetchOrdinances = () => apiCall("get", "/ordinances");
export const fetchOrdinanceById = (id) => apiCall("get", `/ordinances/${id}`);
export const deleteOrdinance = (id) => apiCall("delete", `/ordinances/${id}`);
export const updateOrdinanceStatus = (id, status) =>
  apiCall("put", `/ordinances/${id}`, { status });

// Create Ordinance (supports file upload)
export const createOrdinance = async (formData) => {
  const data = new FormData();
  Object.keys(formData).forEach((key) => {
    data.append(key, formData[key]);
  });

  return apiCall("post", "/ordinances", data, true);
};

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
