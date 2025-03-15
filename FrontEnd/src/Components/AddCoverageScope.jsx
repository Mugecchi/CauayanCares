import React, { useState, useEffect } from "react";
import { apiCall } from "../api"; // ✅ Import API helper
import {
  Autocomplete,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const AddCoverageScope = () => {
  const [ordinances, setOrdinances] = useState([]);
  const [formData, setFormData] = useState({
    ordinance_id: "",
    inclusive_period: "",
    target_beneficiaries: "General Public",
    geographical_coverage: "",
  });

  useEffect(() => {
    fetchOrdinances();
  }, []);

  const fetchOrdinances = async () => {
    try {
      const data = await apiCall("get", "/ordinances"); // ✅ Use `apiCall`
      setOrdinances(data);
    } catch (error) {
      console.error("Error fetching ordinances:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall("post", "/coverage_scope", formData); // ✅ Use `apiCall`
      alert("Coverage scope added successfully!");
    } catch (error) {
      console.error("Error adding coverage scope:", error);
    }
  };

  return (
    <>
      <Typography variant="h5">Coverage Scope</Typography>
      <form onSubmit={handleSubmit}>
        <Autocomplete
          options={ordinances}
          getOptionLabel={(option) => `${option.title} (${option.number})`}
          value={
            ordinances.find((ord) => ord.id === formData.ordinance_id) || null
          }
          onChange={(event, newValue) => {
            setFormData((prev) => ({
              ...prev,
              ordinance_id: newValue ? newValue.id : "",
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Record Title/Number" />
          )}
        />

        <TextField
          type="text"
          name="inclusive_period"
          label="Inclusive Period"
          value={formData.inclusive_period}
          onChange={handleChange}
          required
        />
        <TextField
          name="target_beneficiaries"
          label="Target Beneficiaries"
          value={formData.target_beneficiaries}
          onChange={handleChange}
          select
          required
        >
          {[
            "General Public",
            "Women",
            "Children",
            "Solo Parents",
            "PWDs",
            "MSMEs",
            "Others",
          ].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="text"
          label="Geographical Coverage"
          name="geographical_coverage"
          value={formData.geographical_coverage}
          onChange={handleChange}
          required
        />
        <Button variant="contained" type="submit">
          Add Coverage Scope
        </Button>
      </form>
    </>
  );
};

export default AddCoverageScope;
