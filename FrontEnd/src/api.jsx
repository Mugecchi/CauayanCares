import axios from "axios";
const API_BASE_URL =
	import.meta.env.MODE === "development"
		? "http://localhost:5000/api" // Local development
		: `${window.location.origin}/api`; // Automatically use the Railway domain in production

export default API_BASE_URL;

const IMG_BASE_URL =
	import.meta.env.MODE === "development"
		? "http://localhost:5000" // Local development
		: `${window.location.origin}`;
const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Ensures cookies (sessions) are sent with requests
});

// Generic API request function
export const apiCall = async (
	method,
	url,
	data = null,
	isFormData = false,
	config = {}
) => {
	try {
		const response = await api({
			method,
			url,
			data,
			...config, // Ensure params are included in the config
		});
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
		localStorage.clear();
		sessionStorage.clear();
	} catch (error) {
		throw error.response?.data?.error || "Logout failed";
	}
};

// export const fetchOrdinanceById = (id) => apiCall("get", `/ordinances/${id}`);

//Dashboard
export const fetchDashboardCounts = () => apiCall("get", "/dashboard");
export const fetchUser = async () => {
	return apiCall("get", "/user"); // Assuming "/protected" returns user data if logged in
};
//Authentication
export const login = async (credentials) => {
	try {
		const response = await api.post("/login", credentials);
		localStorage.setItem("userToken", response.data.token); // Store token
		return response.data; // Return the response to handle success in Login.jsx
	} catch (error) {
		throw error.response?.data?.error || "Login failed";
	}
};

export const handlePreview = async (
	filePath,
	setSelectedFile,
	setOpenPreview
) => {
	if (!filePath || filePath.trim() === "") {
		alert("No file selected for preview.");
		return; // Do not open the modal
	}

	// Construct the file URL
	const previewUrl = `${API_BASE_URL.replace(
		"/api",
		""
	)}/uploads/${encodeURIComponent(filePath)}`;

	try {
		// Check if the file exists using a HEAD request
		const response = await fetch(previewUrl, { method: "HEAD" });

		if (!response.ok) {
			throw new Error("File not found or cannot be accessed.");
		}

		// Additional check: Ensure response is a valid file type
		const contentType = response.headers.get("Content-Type");
		if (!contentType || contentType.startsWith("text/html")) {
			throw new Error("Invalid file type. The file might be missing.");
		}

		// If file exists and is valid, open preview
		setSelectedFile(previewUrl);
		setOpenPreview(true);
	} catch (error) {
		console.error("Error previewing file:", error);
		alert("The selected file does not exist or is inaccessible.");
	}
};

// Ordinances
export const createOrdinance = (formData) =>
	apiCall("post", "/ordinances", formData);
export const fetchOrdinances = (page = 1, per_page = 10) => {
	return apiCall("get", "/ordinances", null, false, {
		params: {
			page,
			per_page,
		},
	});
};

export const deleteOrdinance = (id) => apiCall("delete", `/ordinances/${id}`);
export const updateOrdinance = (id, formData) =>
	apiCall("put", `/ordinances/${id}`, formData);

//Coverage Scope
export const fetchOrdinancesCoverage = () =>
	apiCall("get", "/ordinancesCoverage");
export const addCoverageScope = (data) =>
	apiCall("post", "/coverage_scope", data);
export const updateCoverageScope = (id, data) =>
	apiCall("put", `/coverage_scope/${id}`, data);
export const deleteCoverageScope = (id) =>
	apiCall("delete", `/coverage_scope/${id}`);

//Objectives Implementation
export const addObjectivesImplementation = (data) =>
	apiCall("post", "/objectives_implementation", data);
export const updateObjectivesImplementation = (id, data) =>
	apiCall("put", `/objectives_implementation/${id}`, data);
export const deleteObjectivesImplementation = (id) =>
	apiCall("delete", `/objectives_implementation/${id}`);
export const fetchObjectivesImplementation = () =>
	apiCall("get", "/objectives_implementation");

//Budget
export const fetchFinancialData = () => apiCall("get", "/financial");
export const addFinancialData = (data) => apiCall("post", "/financial", data);
export const updateFinancialData = (id, data) =>
	apiCall("put", `/financial/${id}`, data);
export const deleteFinancialData = (id) =>
	apiCall("delete", `/financial/${id}`);

//Monitoring
export const fetchMonitoring = () => apiCall("get", "/monitoring");
export const addMonitoring = (data) => apiCall("post", "/monitoring", data);
export const updateMonitoring = (id, data) =>
	apiCall("put", `/monitoring/${id}`, data);
export const deleteMonitoring = (id) => apiCall("delete", `/monitoring/${id}`);

//Assessment
export const fetchAssesment = () => apiCall("get", "/assessment");
export const addAssesment = (data) => apiCall("post", "/assessment", data);
export const updateAssesment = (id, data) =>
	apiCall("put", `/assessment/${id}`, data);
export const deleteAssesment = (id) => apiCall("delete", `/assessment/${id}`);

//Documentation reports
export const fetchDocumentation = () => apiCall("get", "/documentation");
export const addDocumentation = (formData) =>
	apiCall("post", "/documentation", formData, true); // 'true' indicates it's form data

export const updateDocumentation = (id, formData) =>
	apiCall("put", `/documentation/${id}`, formData, {
		headers: { "Content-Type": "multipart/form-data" }, // Ensure correct content type
	});

export const fetchAllTable = () => apiCall("get", "/table");

export const deleteDocumentation = (id) =>
	apiCall("delete", `/documentation/${id}`);

//users admin only
// 🟢 Get user's avatar URL
export const getAvatarUrl = (filename) => {
	if (!filename) return "/default-avatar.png"; // Fallback avatar
	return `${IMG_BASE_URL}/uploads/profile_pictures/${filename}`;
};
// 🟢 Fetch all users (Admin Only)
export const fetchUsers = () => apiCall("get", "/users");

// 🟢 Create a new user (with Avatar)
export const createUser = (formData) =>
	apiCall("post", "/users", formData, true);

// 🟢 Update user (with Avatar)
export const updateUser = (id, formData) =>
	apiCall("put", `/users/${id}`, formData, true);

// 🟢 Delete user
export const deleteUser = (id) => apiCall("delete", `/users/${id}`);

// 🟢 Upload Avatar (Profile Picture)
export const uploadAvatar = (userId, file) => {
	const formData = new FormData();
	formData.append("avatar", file);
	return apiCall("post", `/users/${userId}/avatar`, formData, true);
};

export const getLogs = () => apiCall("get", "/records/logs");
