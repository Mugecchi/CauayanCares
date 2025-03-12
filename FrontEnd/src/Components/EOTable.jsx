import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";

import {
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { Delete, Visibility, Close } from "@mui/icons-material";

const BASE_URL = "http://localhost:5000";

const EOTable = () => {
  const [ordinances, setOrdinances] = useState([]);
  const tableRef = useRef(null);
  const containerRef = useRef(null);
  const dataTableInstance = useRef(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [tableHeight, setTableHeight] = useState("auto");

  useEffect(() => {
    fetchOrdinances();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() => adjustTableHeight());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    if (ordinances.length > 0) {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
      }

      dataTableInstance.current = $(tableRef.current).DataTable({
        responsive: true,
        destroy: true,
        autoWidth: false,
        scrollY: `${tableHeight}px`,
        scrollCollapse: true,
        paging: true,
        lengthChange: false,
      });
    }
  }, [ordinances, tableHeight]);

  const adjustTableHeight = () => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const adjustedHeight = Math.max(200, containerHeight - 150); // Leave room for headers
      setTableHeight(adjustedHeight);
    }
  };

  const fetchOrdinances = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/ordinances`, {
        withCredentials: true,
      });
      setOrdinances(response.data);
    } catch (error) {
      console.error("Error fetching ordinances:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ordinance?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/api/ordinances/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchOrdinances();
      } catch (error) {
        console.error("Error deleting ordinance:", error);
        alert("Failed to delete the ordinance.");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/ordinances/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      fetchOrdinances();
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
      alert("Failed to update status.");
    }
  };

  const handlePreview = (filePath) => {
    setSelectedFile(`${BASE_URL}/uploads/${filePath}`);
    setOpenPreview(true);
  };

  return (
    <div ref={containerRef} style={{ height: "80vh", overflow: "hidden" }}>
      <table ref={tableRef} className="display" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Number</th>
            <th>Policies</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ordinances.map((ordinance) => (
            <tr key={ordinance.id}>
              <td>{ordinance.title}</td>
              <td>{ordinance.document_type}</td>
              <td>{ordinance.number}</td>
              <td>{ordinance.policies}</td>
              <td>
                <Select
                  value={ordinance.status}
                  onChange={(e) =>
                    handleStatusChange(ordinance.id, e.target.value)
                  }
                  sx={{ minWidth: "120px", width: "120px" }}
                >
                  {[
                    "Pending",
                    "Approved",
                    "Implemented",
                    "Under Review",
                    "Amended",
                  ].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </td>
              <td>
                {ordinance.file_path && (
                  <IconButton
                    onClick={() => handlePreview(ordinance.file_path)}
                  >
                    <Visibility />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => handleDelete(ordinance.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* File Preview Modal */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        fullScreen
        fullWidth
      >
        <DialogContent dividers>
          {selectedFile ? (
            <iframe
              src={selectedFile}
              title="File Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <Typography>No file selected.</Typography>
          )}
        </DialogContent>
        <IconButton
          onClick={() => setOpenPreview(false)}
          sx={{
            bottom: "20px",
            left: "calc(50vw)",
            position: "fixed",
            zIndex: 100,
            backgroundColor: "#5D3786",
            color: "white",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#ff7706", color: "white" },
          }}
        >
          <Close />
        </IconButton>
      </Dialog>
    </div>
  );
};

export default EOTable;
