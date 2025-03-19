import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api"; // ✅ Import the login function
import { Box, TextField, Typography } from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		try {
			await login({ username, password }); // ✅ Uses `login` from api.jsx
			setIsLoggedIn(true);
			navigate("/dashboard");
		} catch (err) {
			setError(err || "Login failed");
		}
	};

	return (
		<Box
			sx={{ background: "#5D378C", height: "100%", margin: 0, padding: "30px" }}
		>
			<img
				src="/LoginPoster.svg"
				style={{ position: "absolute", bottom: "10%", zIndex: "0" }}
			/>
			{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
			<Box
				sx={{
					background: "#FBEAFF",
					padding: "40px",
					borderRadius: "10px",
					height: "50%",
					width: "30%",
					alignContent: "center",
					justifyContent: "center",
					color: "#ff7707",
				}}
			>
				<Typography variant="h5" sx={{ fontWeight: "Bold" }}>
					Login
				</Typography>
				<Typography>Please enter your login credentials</Typography>
				<br />
				<form onSubmit={handleLogin}>
					<Box>
						<TextField
							fullWidth
							type="text"
							label="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</Box>
					<Box>
						<TextField
							type="password"
							fullWidth
							label="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Box>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
					>
						Login
					</button>
				</form>
			</Box>
		</Box>
	);
};

export default Login;
