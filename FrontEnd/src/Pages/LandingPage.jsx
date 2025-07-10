import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { WhiteBox } from "../Includes/styledComponents";
import EOTable from "../Components/EOTable";
import WaveBackground from "../Includes/WaveBackground";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Layout = styled(motion.div)`
	display: grid;
	color: white;
	grid-template-areas:
		"header"
		"main"
		"footer";
	grid-template-rows: auto 1fr auto;
	min-height: 100vh;
`;
const Header = styled(motion.header)`
	grid-area: header;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	width: 100%;
	opacity: 0; /* <-- default state */
`;

const Main = styled(motion.main)`
	grid-area: main;
	padding: 20px;
`;

const Footer = styled(motion.footer)`
	grid-area: footer;
	width: 100%;
`;
const LandingPage = () => {
	const [showTable, setShowTable] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowTable(true);
		}, 1500); // ⏱️ Delay in milliseconds (e.g. 1.5 seconds)

		return () => clearTimeout(timer); // Clean up if unmounted early
	}, []);

	return (
		<Layout>
			<Button
				onClick={() => navigate("/login")}
				variant={"outlined"}
				sx={{ position: "fixed", zIndex: 500, right: 20, top: 20 }}
			>
				Return to Login Screen
			</Button>
			<Header
				initial={{ y: -1000, opacity: 0 }}
				animate={{
					y: 0,
					opacity: 1,
				}}
				transition={{
					y: { duration: 2, type: "spring" },
				}}
			>
				<Container maxWidth="xl">
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							transform: "scaleY(-1)",
							zIndex: 2, // 👈 on top
							pointerEvents: "none", // optional: let clicks pass through
						}}
					>
						<WaveBackground />
					</Box>

					<Grid
						direction={"row"}
						container
						justifyContent={"center"}
						alignContent={"center"}
						height={"100%"}
						spacing={10}
					>
						<Grid item xs={6} justifyContent={"center"} alignContent={"center"}>
							<motion.div
								initial={{ y: -1000 }}
								animate={{ y: 0 }}
								transition={{ type: "spring", duration: 1, delay: 1.5 }}
							>
								<Typography
									variant="h2"
									sx={{
										fontSize: "48px", // fixed size
										color: "#FF7704",
										fontWeight: 600,
									}}
								>
									Welcome to Cauayan Cares
								</Typography>

								<Typography
									variant="h4"
									sx={{
										fontSize: "3rem", // fixed size
										fontWeight: 600,
									}}
								>
									Archiving System: Preserving Records, Empowering Communities
								</Typography>
							</motion.div>
						</Grid>
						<Grid
							item
							xs={6}
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<motion.div
								initial={{ x: 1000 }}
								animate={{ x: 0 }}
								transition={{ type: "spring", duration: 1, delay: 1.5 }}
							>
								<img
									src={"./LPvec.svg"}
									alt="Cauayan Cares Vector"
									style={{
										maxHeight: "100%",
										maxWidth: "100%",
										transform: "rotate(10deg)", // 👈 negative = tilt left, positive = tilt right
										transformOrigin: "center",
									}}
								/>
							</motion.div>
						</Grid>
					</Grid>
					<motion.div
						animate={{ opacity: [0, 1, 0] }}
						transition={{
							duration: 2, // slower = smoother
							repeat: Infinity,
							repeatType: "loop",
							ease: "easeInOut", // smooth transition
						}}
						style={{
							position: "absolute",
							bottom: "20px",
							left: "50%",
							transform: "translateX(-50%)",
							zIndex: 1000,
							color: "#fff",
							fontWeight: "bold",
							fontSize: "1.2rem",
							textShadow: "0 0 5px rgba(0,0,0,0.5)",
						}}
					>
						↓ Scroll Down
					</motion.div>
				</Container>
			</Header>

			<Main
				initial={{ x: 1000 }}
				animate={{ x: 0 }}
				transition={{ duration: 2, type: "spring" }}
			>
				<Container maxWidth="xl">
					<WhiteBox>
						{showTable ? (
							<Box height={"calc(80vh)"}>
								<EOTable />
							</Box>
						) : (
							<Box height={"calc(80vh)"} />
						)}
					</WhiteBox>
				</Container>
			</Main>

			<Footer>
				<Box
					sx={{
						width: "100%",
						bgcolor: "#1a1a1a",
						color: "white",
						py: 4,
						px: 3,
					}}
				>
					<Container maxWidth="xl">
						<Grid container spacing={4}>
							{/* System Info */}
							<Grid item xs={12} md={4}>
								<Typography
									variant="h6"
									sx={{ mb: 2, color: "#FF7704", fontWeight: 600 }}
								>
									Cauayan Cares Archiving System
								</Typography>
								<Typography
									variant="body2"
									sx={{ mb: 2, color: "#cccccc", lineHeight: 1.6 }}
								>
									Preserving community records and empowering citizens through
									accessible digital archives. Serving the people of Cauayan
									with transparent and efficient record management.
								</Typography>
								<Typography variant="caption" sx={{ color: "#999999" }}>
									Established 2024 • Serving the Community
								</Typography>
							</Grid>

							{/* Quick Links */}
							<Grid item xs={12} md={4}>
								<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
									Quick Access
								</Typography>
								<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
									<Typography
										variant="body2"
										sx={{
											color: "#cccccc",
											cursor: "pointer",
											"&:hover": { color: "#FF7704" },
										}}
									>
										🔍 Search Records
									</Typography>
									<Typography
										variant="body2"
										sx={{
											color: "#cccccc",
											cursor: "pointer",
											"&:hover": { color: "#FF7704" },
										}}
									>
										📁 Document Categories
									</Typography>
									<Typography
										variant="body2"
										sx={{
											color: "#cccccc",
											cursor: "pointer",
											"&:hover": { color: "#FF7704" },
										}}
									>
										📊 Public Reports
									</Typography>
									<Typography
										variant="body2"
										sx={{
											color: "#cccccc",
											cursor: "pointer",
											"&:hover": { color: "#FF7704" },
										}}
									>
										🏛️ Government Services
									</Typography>
									<Typography
										variant="body2"
										sx={{
											color: "#cccccc",
											cursor: "pointer",
											"&:hover": { color: "#FF7704" },
										}}
									>
										❓ Help & Support
									</Typography>
								</Box>
							</Grid>

							{/* Contact Info */}
							<Grid item xs={12} md={4}>
								<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
									Contact Information{" "}
									<span style={{ color: "gray" }}>(sample only)</span>
								</Typography>
								<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
									<Typography variant="body2" sx={{ color: "#cccccc" }}>
										📍 Cauayan City, Isabela, Philippines
									</Typography>
									<Typography variant="body2" sx={{ color: "#cccccc" }}>
										📞 (078) 123-4567
									</Typography>
									<Typography variant="body2" sx={{ color: "#cccccc" }}>
										📧 archives@cauayancares.gov.ph
									</Typography>
									<Typography variant="body2" sx={{ color: "#cccccc" }}>
										🌐 www.cauayancares.gov.ph
									</Typography>
								</Box>
							</Grid>
						</Grid>

						{/* Bottom Section */}
						<Box
							sx={{
								borderTop: "1px solid #333",
								mt: 3,
								pt: 3,
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexWrap: "wrap",
								gap: 2,
							}}
						>
							<Typography variant="body2" sx={{ color: "#999999" }}>
								© 2024 Cauayan Cares Archiving System. All rights reserved.
							</Typography>

							<Box sx={{ display: "flex", gap: 3 }}>
								<Typography
									variant="body2"
									sx={{
										color: "#999999",
										cursor: "pointer",
										"&:hover": { color: "#FF7704" },
									}}
								>
									Privacy Policy
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: "#999999",
										cursor: "pointer",
										"&:hover": { color: "#FF7704" },
									}}
								>
									Terms of Service
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: "#999999",
										cursor: "pointer",
										"&:hover": { color: "#FF7704" },
									}}
								>
									Accessibility
								</Typography>
							</Box>
						</Box>
						<Typography
							variant="subtitle2"
							sx={{ color: `rgba(219, 219, 219,0.4)` }}
						>
							JCD INNOVATION CENTER
						</Typography>
						{/* System Status */}
						<Box sx={{ mt: 2, textAlign: "center" }}>
							<Typography
								variant="caption"
								sx={{
									color: "#666666",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: 1,
								}}
							>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: "50%",
										bgcolor: "#4CAF50",
									}}
								></Box>
								System Status: Online • Last Updated:{" "}
								{new Date().toLocaleDateString()}
							</Typography>
						</Box>
					</Container>
				</Box>
			</Footer>
		</Layout>
	);
};

export default LandingPage;
