import React from "react";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";

const LoadingScreen = () => {
	return (
		<div
			style={{
				display: "flex",
				height: "100vh",
				perspective: "1000px", // Enables 3D depth perception
			}}
		>
			<div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					flex={1}
					flexDirection="column"
					gap={3}
				>
					<motion.img
						src="logo.png"
						alt="Loading..."
						style={{
							width: 100,
							height: 100,
							transformStyle: "preserve-3d",
						}}
						initial={{ scale: 0 }}
						animate={{ rotateY: [0, 360], scale: [0.8, 2, 1] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "linear",
						}}
					/>

					<motion.p
						style={{ fontSize: "1.2rem", fontWeight: 500 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						Loading, please wait...
					</motion.p>
				</Box>
			</div>
		</div>
	);
};

export default LoadingScreen;
