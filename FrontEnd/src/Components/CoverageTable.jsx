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

export default function CoverageTable() {
  const [ordinances, setOrdinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchOrdinances = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ordinancesCoverage",
          {
            withCredentials: true,
          }
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
  const filteredOrdinances = ordinances.flatMap((ordinance) =>
    ordinance.coverage_scopes
      .filter(
        (scope) =>
          ordinance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scope.inclusive_period
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          scope.target_beneficiaries
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          scope.geographical_coverage
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
      .map((scope) => ({
        id: `${ordinance.id}-${scope.id}`,
        title: ordinance.title,
        inclusive_period: scope.inclusive_period,
        target_beneficiaries: scope.target_beneficiaries,
        geographical_coverage: scope.geographical_coverage,
      }))
  );

  // Slice for pagination
  const displayedOrdinances = filteredOrdinances.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Pagination handlers
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
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ backgroundColor: "white" }}
      />

      <TableContainer2 component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Inclusive Period</TableCell>
              <TableCell>Target Beneficiaries/Categories</TableCell>
              <TableCell>Geographical Coverage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedOrdinances.map((scope) => (
              <TableRow key={scope.id} hover>
                <TableCell>{scope.title}</TableCell>
                <TableCell>{scope.inclusive_period}</TableCell>
                <TableCell>{scope.target_beneficiaries}</TableCell>
                <TableCell>{scope.geographical_coverage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer2>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
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
