import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RequirementAccordion = ({ req, children }) => {
  return (
    <Accordion sx={{ mt: "12px" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{req.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default RequirementAccordion;
