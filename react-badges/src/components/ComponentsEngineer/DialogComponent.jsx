import React from "react";
import {
  TextField,
  FormGroup,
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

const CustomDialog = ({
  open,
  onClose,
  title,
  contentText,
  closeButton,
  viewProposalButton,
  viewProposalClick
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h2" fontWeight="bold">
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">{contentText}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {closeButton}
        </Button>
        {viewProposalButton && viewProposalClick && (
          <Button
            variant="outlined"
            color="primary"
            onClick={viewProposalClick}
          >
            {viewProposalButton}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
