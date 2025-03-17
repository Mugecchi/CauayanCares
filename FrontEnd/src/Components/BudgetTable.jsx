import React, { useState, useEffect, useRef } from "react";
import { Typography, CircularProgress, TableContainer } from "@mui/material";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import { fetchFinancialData } from "../api"; // Import the fetchFinancialData function from api.jsx

export default function BudgetTable() {
	const [ordinances, setOrdinances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const tableRef = useRef(null);
	const containerRef = useRef(null);
	const dataTableInstance = useRef(null);
	const [tableHeight, setTableHeight] = useState(500);

	// Fetch financial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetchFinancialData(); // Fetch financial data
				setOrdinances(response); // Assuming response is the array of ordinances with budget data
			} catch (err) {
				setError("No financial records found.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Adjust table height dynamically
	const adjustTableHeight = () => {
		if (containerRef.current) {
			const containerHeight = containerRef.current.clientHeight;
			const adjustedHeight = Math.max(200, containerHeight - 200); // Leave room for headers
			setTableHeight(adjustedHeight);
		}
	};

	useEffect(() => {
		if (ordinances.length > 0) {
			if (dataTableInstance.current) {
				dataTableInstance.current.destroy(); // Destroy previous instance
			}

			adjustTableHeight();

			// Observe container resizing
			const observer = new ResizeObserver(() => adjustTableHeight());
			observer.observe(containerRef.current);

			// Initialize DataTable
			dataTableInstance.current = $(tableRef.current).DataTable({
				responsive: true,
				destroy: true,
				autoWidth: false,
				scrollY: `${tableHeight}px`,
				scrollCollapse: true,
				paging: true,
				pageLength: 10,
				lengthChange: false,
			});

			return () => observer.disconnect(); // Cleanup
		}
	}, [ordinances, tableHeight]);

	if (loading) return <CircularProgress />; // Loading indicator
	if (error) return <Typography color="error">{error}</Typography>; // Error message

	return (
		<TableContainer
			ref={containerRef}
			style={{ height: "100%", width: "100%" }}
		>
			<table ref={tableRef} className="display" style={{ width: "100%" }}>
				<thead>
					<tr>
						<th>Title</th>
						<th>Number</th>
						<th>Status</th>
						<th>Document Type</th>
						<th>Allocated Budget</th>
						<th>Utilized Budget</th>
						<th>GAD Budget</th>
						<th>Transparency Measures</th>
					</tr>
				</thead>
				<tbody>
					{ordinances
						.flatMap((ordinance) =>
							ordinance.budget_allocation?.map((budget) => ({
								id: budget.id,
								title: ordinance.title,
								number: ordinance.number,
								status: ordinance.status,
								document_type: ordinance.document_type,
								allocated_budget: budget.allocated_budget || "N/A",
								utilized_budget: budget.utilized_budget || "N/A",
								gad_budget: budget.gad_budget || "N/A",
								financial_transparency_measures:
									budget.financial_transparency_measures || "N/A",
							}))
						)
						.map((row) => (
							<tr key={row.id}>
								<td>{row.title}</td>
								<td>{row.number}</td>
								<td>{row.status}</td>
								<td>{row.document_type}</td>
								<td>{row.allocated_budget}</td>
								<td>{row.utilized_budget}</td>
								<td>{row.gad_budget}</td>
								<td>{row.financial_transparency_measures}</td>
							</tr>
						))}
				</tbody>
			</table>
		</TableContainer>
	);
}
