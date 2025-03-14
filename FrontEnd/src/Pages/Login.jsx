import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// ✅ Check if user is already logged in
	useEffect(() => {
		const token = localStorage.getItem("userToken");
		if (token) {
			navigate("/dashboard"); // Redirect to dashboard if already logged in
		}
	}, [navigate]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const response = await axios.post(
				"http://localhost:5000/api/login",
				{ username, password },
				{ withCredentials: true }
			);

			localStorage.setItem("userToken", response.data.token); // Store token
			setIsLoggedIn(true); // Update state
			navigate("/dashboard"); // Redirect after login
		} catch (err) {
			setError(err.response?.data?.error || "Login failed");
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-96">
				<h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
				{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
				<form onSubmit={handleLogin}>
					<div className="mb-4">
						<label className="block text-gray-700">Username</label>
						<input
							type="text"
							className="w-full p-2 border rounded-lg"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Password</label>
						<input
							type="password"
							className="w-full p-2 border rounded-lg"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
