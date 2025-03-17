import { useState, useEffect, useRef } from "react";
import { Typography, CircularProgress } from "@mui/material";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import $ from "jquery";
import "datatables.net";
import { fetchOrdinancesCoverage } from "../api"; // Importing the API function

export default function CoverageTable() {
	const [ordinances, setOrdinances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const tableRef = useRef(null);
	const containerRef = useRef(null);
	const dataTableInstance = useRef(null);
	const [tableHeight, setTableHeight] = useState("500px"); // Default height

	useEffect(() => {
		const getCoverage = async () => {
			try {
				const response = await fetchOrdinancesCoverage();
				setOrdinances(response); // Response data from the API function
			} catch (err) {
				setError("No Ordinance Found.");
			} finally {
				setLoading(false);
			}
		};

		getCoverage();
	}, []);

	// Adjust table height dynamically
	const adjustTableHeight = () => {
		if (containerRef.current?.parentElement) {
			const parentHeight = containerRef.current.parentElement.clientHeight;
			setTableHeight(`calc(${parentHeight}px - 10px)`); // Subtract margin/padding
		}
	};

	useEffect(() => {
		if (ordinances.length > 0) {
			if (dataTableInstance.current) {
				dataTableInstance.current.destroy();
			}

			// Adjust table height dynamically
			adjustTableHeight();

			// Observe parent height changes
			const observer = new ResizeObserver(() => adjustTableHeight());
			observer.observe(containerRef.current.parentElement);

			// Initialize DataTable
			dataTableInstance.current = $(tableRef.current).DataTable({
				responsive: true,
				destroy: true,
				autoWidth: false,
				scrollY: tableHeight,
				scrollCollapse: true,
				paging: true,
				pageLength: 10, // Default to 10 rows
				lengthChange: false,
			});

			return () => observer.disconnect(); // Cleanup observer
		}
	}, [ordinances, tableHeight]);

	// Loading state
	if (loading) return <CircularProgress />;

	// Error state
	if (error) return <Typography color="error">{error}</Typography>;

	return (
		<div ref={containerRef} style={{ height: "100%", width: "100%" }}>
			<table ref={tableRef} className="display" style={{ width: "100%" }}>
				<thead>
					<tr>
						<th>Title</th>
						<th>Inclusive Period</th>
						<th>Target Beneficiaries/Categories</th>
						<th>Geographical Coverage</th>
					</tr>
				</thead>
				<tbody>
					{ordinances.flatMap((ordinance) =>
						ordinance.coverage_scopes.map((scope) => (
							<tr key={`${ordinance.id}-${scope.id}`}>
								<td>
									{ordinance.title} {ordinance.number}
								</td>
								<td>{scope.inclusive_period}</td>
								<td>{scope.target_beneficiaries}</td>
								<td>{scope.geographical_coverage}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
