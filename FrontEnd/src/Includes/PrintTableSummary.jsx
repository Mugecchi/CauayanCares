import Button from "@mui/material/Button";

const PrintTableSummary = ({ ordinances }) => {
const handlePrint = () => {
	const printWindow = window.open("", "_blank");
	printWindow.document.write(`
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Records Summary</title>
	<style>
		body {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			padding: 30px;
			background-color: #f4f6fa;
			color: #2c3e50;
			line-height: 1.6;
		}

		h2 {
			text-align: center;
			margin-bottom: 30px;
			color: #34495e;
			font-size: 28px;
			letter-spacing: 1px;
		}

		ol {
			padding-left: 0;
			list-style: none;
			max-width: 800px;
			margin: 0 auto;
		}

		.summary-item {
			background: #ffffff;
			padding: 20px;
			margin-bottom: 15px;
			border-left: 6px solid #3498db;
			border-radius: 8px;
			box-shadow: 0 2px 5px rgba(0,0,0,0.05);
			transition: background 0.3s ease-in-out;
		}

		.summary-item:hover {
			background: #f9fbfd;
		}

		.summary-item strong {
			color: #2c3e50;
			font-weight: 600;
		}

		.print-btn, .scroll-btn {
			display: block;
			width: 180px;
			margin: 10px auto;
			padding: 12px 20px;
			text-align: center;
			background: #3498db;
			color: #fff;
			border: none;
			border-radius: 6px;
			cursor: pointer;
			font-size: 16px;
			font-weight: bold;
			box-shadow: 0 2px 5px rgba(0,0,0,0.1);
			transition: background 0.3s;
		}

		.print-btn:hover, .scroll-btn:hover {
			background: #2980b9;
		}

		.scroll-btn {
			position: fixed;
			bottom: 10px;
			right: 30px;
			width: 60px;
            height:60px;
			padding: 10px 14px;
			border-radius: 50%;
			font-size: 18px;
			box-shadow: 0 4px 10px rgba(0,0,0,0.15);
		}

		@media print {
			.print-btn, .scroll-btn { display: none; }
			body {
				background: #fff;
				padding: 0;
				color: #000;
			}
			.summary-item {
				page-break-inside: avoid;
				border-left-color: #000;
				box-shadow: none;
			}
		}
	</style>
</head>
<body>

	<div class="summary-container">
		<h2>Records Summary</h2>
		<ol>
			${ordinances
				.map(
					(ordinance) => `
				<li class="summary-item">
					<strong>Title:</strong> ${ordinance.title} <br/>
					<strong>Type:</strong> ${ordinance.document_type} <br/>
					<strong>Date Issued:</strong> ${new Intl.DateTimeFormat("en-US", {
						dateStyle: "medium"
					}).format(new Date(ordinance.date_issued))}
				</li>`
				)
				.join("")}
		</ol>

		<!-- Buttons -->
		<button class="print-btn" onclick="window.print();">Print Summary</button>
		<button class="scroll-btn" onclick="window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });">&#8595;</button>
	</div>

</body>
</html>
	`);
	printWindow.document.close();
};


	return (
		<Button
			onClick={handlePrint}
			style={{
				marginTop: "10px",
				padding: "10px",
				backgroundColor: "#6200ea",
				color: "white",
				border: "none",
				cursor: "pointer",
				borderRadius: "5px",
			}}
		>
			Print Summary
		</Button>
	);
};

export default PrintTableSummary;
