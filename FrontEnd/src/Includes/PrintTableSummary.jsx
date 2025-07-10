import Button from "@mui/material/Button";

const PrintTableSummary = ({ ordinances }) => {
	const handlePrint = () => {
		const printWindow = window.open("Records", "-Summary");

		const borderColors = ["#26355D", "#AF47D2", "#FF8F00", "#FFDB00"];

		const formattedOrdinances = ordinances
			.map((ord, index) => {
				const color = borderColors[index % borderColors.length];
				const dateIssued = new Intl.DateTimeFormat("en-US", {
					dateStyle: "medium",
				}).format(new Date(ord.date_issued));

				return `
					<li class="summary-item" style="border-left-color: ${color};">
						<strong>Title:</strong> ${ord.title}<br/>
						<strong>Number:</strong> ${ord.number}<br/>
						<strong>Type:</strong> ${ord.document_type}<br/>
						<strong>Date Issued:</strong> ${dateIssued}
					</li>
				`;
			})
			.join("");

		const htmlContent = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Records Summary</title>
				<style>
					body {
						font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
						background-color: #f4f6fa;
						color: #2c3e50;
						padding: 30px;
						line-height: 1.6;
					}
					h2 {
						text-align: center;
						color: #34495e;
						font-size: 28px;
						margin-bottom: 30px;
						letter-spacing: 1px;
					}
					ol {
						columns: 2;
						column-gap: 30px;
						list-style: none;
						padding: 0;
						max-width: 1400px;
						margin: 0 auto;
					}
					.summary-item {
						background: #fff;
						margin-bottom: 15px;
						padding: 20px;
						border-left: 6px solid;
						border-radius: 8px;
						box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
						break-inside: avoid;
						transition: background 0.3s;
					}
					.summary-item:hover {
						background: #f9fbfd;
					}
					.summary-item strong {
						color: #2c3e50;
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
						height: 60px;
						padding: 10px 14px;
						border-radius: 50%;
						font-size: 18px;
						box-shadow: 0 4px 10px rgba(0,0,0,0.15);
					}
					@media print {
	body {
		color: #000;
		font-size: 10px; /* Smaller font for print */
	}
	h2 {
		font-size: 15px;
		margin-bottom: 15px;
	}
	.summary-item {
		padding: 12px;
		margin-bottom: 10px;
	}
		.print-btn,
	.scroll-btn {
		display: none !important;
	}
}

				</style>
			</head>
			<body>
				<div class="summary-container">
					<h2>Records Summary</h2>
					<ol>${formattedOrdinances}</ol>
					<button class="print-btn" onclick="window.print();">Print Summary</button>
					<button class="scroll-btn" onclick="window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });">&#8595;</button>
				</div>
			</body>
			</html>
		`;

		printWindow.document.write(htmlContent);
		printWindow.document.close();
	};

	return (
		<Button
			onClick={handlePrint}
			sx={{
				mt: 2,
				px: 3,
				py: 1.5,
				bgcolor: "#6200ea",
				color: "white",
				borderRadius: "5px",
				fontWeight: "bold",
				boxShadow: 2,
				"&:hover": {
					backgroundColor: "#4500b5",
				},
			}}
		>
			Print Summary
		</Button>
	);
};

export default PrintTableSummary;
