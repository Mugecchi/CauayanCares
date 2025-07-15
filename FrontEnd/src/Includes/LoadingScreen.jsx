import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingScreen = () => {
	useEffect(() => {
		const originalPadding = document.body.style.padding;
		document.body.style.padding = "0";

		return () => {
			document.body.style.padding = originalPadding; // Restore padding after unmount
		};
	}, []);

	return (
		<Box
			sx={{
				height: "100vh",
				width: "100vw",
				backgroundColor: "#0f0f1b",
				display: "flex",
				alignItems: "center",
				zIndex: 10,
				justifyContent: "center",
				flexDirection: "column",
				position: "relative",
			}}
		>
			{/* Glowing Blur Background */}
			<motion.div
				style={{
					position: "absolute",
					width: 300,
					height: 300,
					borderRadius: "50%",
					background: "radial-gradient(circle, #c084fc 0%, transparent 70%)",
					filter: "blur(100px)",
					zIndex: 0,
				}}
				animate={{
					scale: [1, 1.5, 1],
					opacity: [0.5, 1, 0.5],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Logo Animation */}
			<motion.img
				src="logo.png"
				alt="Loading"
				style={{
					width: 120,
					height: 120,
					zIndex: 1,
				}}
				initial={{ scale: 0.8, rotate: 0, opacity: 0 }}
				animate={{
					scale: [0.8, 1.1, 1],
					rotate: [0, 360],
					opacity: [0.6, 1],
				}}
				transition={{
					duration: 2.5,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Text Animation */}
			<motion.p
				style={{
					fontSize: "1.2rem",
					color: "#e0e0e0",
					marginTop: 30,
					zIndex: 1,
					fontWeight: 500,
				}}
				animate={{ opacity: [0.5, 1, 0.5] }}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			>
				Preparing your experience...
			</motion.p>

			{/* Optional Spinner Below */}
			<Box mt={2} zIndex={1}>
				<CircularProgress color="secondary" size={30} />
			</Box>
		</Box>
	);
};

export default LoadingScreen;
