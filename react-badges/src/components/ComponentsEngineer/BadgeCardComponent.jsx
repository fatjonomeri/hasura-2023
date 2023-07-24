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

const BadgeCard = ({ badge, handleOpenModal, isManagerListEmpty }) => {
  return (
    <Card key={badge.id} variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {badge.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          marginTop="5px"
          marginBottom="5px"
        >
          {badge.description}
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenModal(badge)}
          disabled={isManagerListEmpty}
        >
          Apply
        </Button>
      </CardContent>
    </Card>
  );
};

export default BadgeCard;
