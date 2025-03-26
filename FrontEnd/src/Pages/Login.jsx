import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api"; // ✅ Import the login function
import { Box, TextField, Typography, Button } from "@mui/material";

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
			sx={{
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#5D378C",
				p: 2,
			}}
		>
			<Box
				sx={{
					display: { xs: "none", md: "block" },
					position: "absolute",
					top: "5%",
					left: "5%",
					zIndex: 0,
					justifyContent: "flex-start",
					textAlign: "left",
				}}
			>
				<Typography variant="h2" color="#FF7704" fontWeight={600}>
					Welcome
				</Typography>
				<Typography variant="h4" fontWeight={600} color="white">
					Cauayan Cares - Archiving System
				</Typography>
				<Typography color="white" variant="h6">
					Preserving Records, Empowering Communities
				</Typography>
			</Box>
			<Box
				sx={{
					display: { xs: "none", md: "block" },
					position: "absolute",
					bottom: "10%",
					left: "5%",
					zIndex: 0,
				}}
			>
				<img
					src="/LoginPoster.svg"
					alt="Login Poster"
					style={{ maxWidth: "100%", height: "auto" }}
				/>
			</Box>

			<Box
				sx={{
					background: "#FBEAFF",
					p: 4,
					borderRadius: "10px",
					width: { xs: "90%", sm: "60%", md: "30%" },
					minWidth: "300px",
					boxShadow: 3,
					right: { xs: "0", md: "10%" },
					position: { xs: "relative", md: "absolute" },
				}}
			>
				<Typography variant="h5" fontWeight="bold" color="#FF7706" gutterBottom>
					Login
				</Typography>
				<Typography color="textSecondary" mb={2}>
					Please enter your login credentials
				</Typography>
				{error && (
					<Typography color="error" mb={2}>
						{error}
					</Typography>
				)}

				<form onSubmit={handleLogin}>
					<Box mb={2}>
						<TextField
							fullWidth
							type="text"
							label="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							variant="outlined"
						/>
					</Box>
					<Box mb={3}>
						<TextField
							fullWidth
							type="password"
							label="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							variant="outlined"
						/>
					</Box>
					<Button
						type="submit"
						variant="contained"
						fullWidth
						sx={{
							bgcolor: "#5D378C",
							color: "#fff",
							":hover": { bgcolor: "#4B2A6F" },
						}}
					>
						Login
					</Button>
				</form>
			</Box>
		</Box>
	);
};

export default Login;
