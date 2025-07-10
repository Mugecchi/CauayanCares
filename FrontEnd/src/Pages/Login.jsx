import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import WaveBackground from "../Includes/WaveBackground";
import { Container } from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
	const navigate = useNavigate();
	// State for login form
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState("");
	// State for forgot password dialog
	const [forgotOpen, setForgotOpen] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotMessage, setForgotMessage] = useState("");
	const [forgotError, setForgotError] = useState("");
	const handleLogin = async (e) => {
		e.preventDefault();
		setLoginError("");

		try {
			await login({ username, password });
			sessionStorage.setItem("isLoggedIn", "true");
			setIsLoggedIn(true);
			navigate("/dashboard");
			setTimeout(() => window.location.reload(), 100);
		} catch (err) {
			setLoginError(err || "Login failed");
		}
	};

	const handleForgotPassword = async () => {
		setForgotError("");
		setForgotMessage("");

		try {
			const response = await fetch("/api/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: forgotEmail }),
			});

			const data = await response.json();
			if (response.ok) {
				setForgotMessage(data.message || "Reset link sent.");
			} else {
				setForgotError(data.error || "Something went wrong.");
			}
		} catch {
			setForgotError("Network error. Try again later.");
		}
	};

	return (
		<Container
			disableGutters
			maxWidth={false}
			sx={{ minHeight: "100vh", position: "relative" }}
		>
			<WaveBackground />
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
			>
				{/* Login Form */}
				<Box
					sx={{
						backdropFilter: "blur(10px)",
						WebkitBackdropFilter: "blur(10px)",
						backgroundColor: "rgba(255, 255, 255, 0.28)",
						p: 4,
						zIndex: 3,
						display: "flex",
						flexDirection: "column",
						borderRadius: "10px",
						boxShadow: 3,

						// Add responsive width:
						width: {
							xs: "90%", // Mobile
							sm: "75%", // Tablets
							md: "50%", // Small laptops
							lg: "30%", // Desktops
							xl: "25%", // Large desktops
						},
						minWidth: "280px", // Ensures usability on tiny screens
					}}
				>
					<Typography
						variant="h4"
						fontWeight={700}
						color="#FF7706"
						gutterBottom
					>
						Cauayan CARES
					</Typography>
					<Typography
						variant="h5"
						fontWeight="bold"
						color="var(--eminence)"
						gutterBottom
					>
						Login
					</Typography>
					<Typography color="textSecondary" mb={2} sx={{ color: "white" }}>
						Please enter your login credentials
					</Typography>

					{loginError && (
						<Typography color="error" mb={2}>
							{loginError}
						</Typography>
					)}

					<form onSubmit={handleLogin}>
						<TextField
							fullWidth
							type="text"
							label="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							variant="outlined"
							margin="normal"
						/>
						<TextField
							fullWidth
							type="password"
							label="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							variant="outlined"
							margin="normal"
						/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							sx={{
								mt: 2,
								bgcolor: "#5D378C",
								color: "#fff",
								"&:hover": {
									bgcolor: "#ff7704",
								},
							}}
						>
							Login
						</Button>
					</form>
					<Button
						variant="outlined"
						sx={{ mt: 1 }}
						onClick={() => navigate("/landingpage")}
					>
						Guest?
					</Button>

					<Typography
						variant="body2"
						sx={{
							mt: 2,
							textAlign: "center",
							cursor: "pointer",
							color: "#5D378C",
						}}
						onClick={() => setForgotOpen(true)}
					>
						Forgot your password?
					</Typography>
				</Box>
			</Box>
			{/* Forgot Password Dialog */}
			<Dialog open={forgotOpen} onClose={() => setForgotOpen(false)}>
				<DialogTitle>Forgot Password</DialogTitle>
				<DialogContent>
					<Typography mb={2}>
						Enter your registered email address to receive a password reset
						link.
					</Typography>

					{forgotError && (
						<Typography color="error" mb={2}>
							{forgotError}
						</Typography>
					)}
					{forgotMessage && (
						<Typography color="primary" mb={2}>
							{forgotMessage}
						</Typography>
					)}

					<TextField
						autoFocus
						margin="dense"
						label="Email Address"
						type="email"
						fullWidth
						variant="outlined"
						value={forgotEmail}
						onChange={(e) => setForgotEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setForgotOpen(false)}>Cancel</Button>
					<Button
						variant="contained"
						sx={{ bgcolor: "#5D378C", ":hover": { bgcolor: "#4B2A6F" } }}
						onClick={handleForgotPassword}
					>
						Send Reset Link
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Login;
