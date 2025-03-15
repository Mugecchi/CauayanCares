import React, { useState } from "react";
import EOForm from "../Components/EOForms";
import AddCoverageScope from "../Components/AddCoverageScope";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddObjectives from "../Components/AddObjectives";
import { WhiteBox } from "../Includes/styledComponents";

function Forms() {
  const [expanded, setExpanded] = useState("eoForm");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <WhiteBox>
      <Accordion
        expanded={expanded === "eoForm"}
        onChange={handleChange("eoForm")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Executive Order Form</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <EOForm />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "coverageScope"}
        onChange={handleChange("coverageScope")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Coverage Scope</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddCoverageScope />
        </AccordionDetails>
      </Accordion>{" "}
      <Accordion
        expanded={expanded === "Objectives"}
        onChange={handleChange("Objectives")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Objectives and Implementations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddObjectives />
        </AccordionDetails>
      </Accordion>
    </WhiteBox>
  );
}

export default Forms;
