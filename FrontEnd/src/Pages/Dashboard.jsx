import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Chart from "react-apexcharts";
import { WhiteBox } from "../Includes/styledComponents";
import { fetchDashboardCounts } from "../api"; // Import API function

const Dashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const data = await fetchDashboardCounts();
      setCounts(data || {}); // Ensure it's never null
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
      setCounts({}); // Set empty object to avoid crashes
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  // Default values to prevent errors
  const {
    pending_count = 0,
    approved_count = 0,
    amended_count = 0,
    under_review_count = 0,
    implemented_count = 0,
  } = counts || {};

  const colors = ["#FF5722", "#4CAF50", "#FFC107", "#2196F3", "#9C27B0"];

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Pending",
        "Approved",
        "Amended",
        "Under Review",
        "Implemented",
      ],
    },
    tooltip: { theme: "light" },
    colors: colors,
    fill: { opacity: 1 },
  };

  const chartSeries = [
    {
      name: "Ordinances",
      data: [
        pending_count,
        approved_count,
        amended_count,
        under_review_count,
        implemented_count,
      ],
    },
  ];

  return (
    <WhiteBox>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Dashboard Overview
      </Typography>

      <Box sx={{ width: "100%", height: "90%", minHeight: "300px" }}>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
          height="100%"
        />
      </Box>
    </WhiteBox>
  );
};

export default Dashboard;
