import React from "react";
import { Alert } from "@mui/material";

const InfoAlert = ({ message }) => {
  return (
    <Alert severity="info" sx={{ marginBottom: "12px" }}>
      {message}
    </Alert>
  );
};

export default InfoAlert;
