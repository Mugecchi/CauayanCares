import { motion } from "framer-motion";

const Wave = ({ path, fill, duration, height }) => (
	<motion.div
		animate={{ x: ["0%", "-30%", "0"], y: ["0%", "10%", "0%"] }}
		transition={{ duration, repeat: Infinity, ease: "linear" }}
		style={{
			display: "flex",
			width: "500%",
			position: "absolute",
			bottom: 0,
			height,
			overflow: "hidden",
			zIndex: 2,
		}}
	>
		{[...Array(2)].map((_, i) => (
			<svg
				key={i}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1440 320"
				preserveAspectRatio="none"
				style={{ width: "100%", height: "100%" }}
			>
				<path fill={fill} d={path} />
			</svg>
		))}
	</motion.div>
);

const WaveBackground = () => {
	return (
		<div
			style={{
				position: "absolute",
				bottom: 0,
				left: 0,
				right: 0,
			}}
		>
			{/* Back layer - slowest and faintest */}
			<Wave
				height="360px"
				duration={30}
				fill="#ffffff22"
				path="M0,64L48,101.3C96,139,192,213,288,240C384,267,480,245,576,208C672,171,768,117,864,117.3C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128V320H0Z"
			/>

			{/* Middle layer - medium speed */}
			<Wave
				height="180px"
				duration={20}
				fill="#ffffff44"
				path="M0,96L60,128C120,160,240,224,360,229.3C480,235,600,181,720,160C840,139,960,149,1080,170.7C1200,192,1320,224,1380,240L1440,256V320H0Z"
			/>

			{/* Front layer - fastest and boldest */}
			<Wave
				height="400px"
				duration={12}
				fill="#ffffff66"
				path="M0,128L80,160C160,192,320,256,480,256C640,256,800,192,960,165.3C1120,139,1280,149,1360,154.7L1440,160V320H0Z"
			/>
		</div>
	);
};

export default WaveBackground;
