import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const CustomSnackbar = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
    >
      <MuiAlert
        onClose={onClose}
        severity={severity}
        elevation={6}
        variant="filled"
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CustomSnackbar;
