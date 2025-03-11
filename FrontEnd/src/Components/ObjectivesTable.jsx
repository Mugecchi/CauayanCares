import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { TableContainer2 } from "../Includes/styledComponents";

export default function ObjectivesTable() {
  const [ordinances, setOrdinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch ordinances
  useEffect(() => {
    const fetchOrdinances = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/objectives_implementation",
          { withCredentials: true }
        );
        setOrdinances(response.data);
      } catch (err) {
        setError("No Ordinance Found.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdinances();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Filter ordinances based on search term
  const filteredOrdinances = ordinances.filter((ordinance) =>
    ordinance.objectives_implementation?.some(
      (scope) =>
        ordinance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scope.policy_objectives
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        scope.lead_agency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scope.supporting_agencies
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        scope.key_provisions
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        scope.programs_activities
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const paginatedData = filteredOrdinances
    .flatMap(
      (ordinance) =>
        ordinance.objectives_implementation?.map((scope) => ({
          id: scope.id,
          title: ordinance.title,
          key_provisions: scope.key_provisions,
          lead_agency: scope.lead_agency,
          policy_objectives: scope.policy_objectives,
          programs_activities: scope.programs_activities,
          supporting_agencies: scope.supporting_agencies,
        })) || []
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Handle page change

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TextField
        label="Search Ordinance"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(0); // Reset page to 1 (index 0) when search changes
        }}
        style={{ backgroundColor: "white" }}
      />
      <TableContainer2 component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Key Provisions</TableCell>
              <TableCell>Lead Agency</TableCell>
              <TableCell>Policy Objectives</TableCell>
              <TableCell>Programs/Activities</TableCell>
              <TableCell>Supporting Agencies</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.key_provisions}</TableCell>
                <TableCell>{row.lead_agency}</TableCell>
                <TableCell>{row.policy_objectives}</TableCell>
                <TableCell>{row.programs_activities}</TableCell>
                <TableCell>{row.supporting_agencies}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer2>

      {/* Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 100]}
        component="div"
        count={filteredOrdinances.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}
