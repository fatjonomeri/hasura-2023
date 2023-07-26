import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";

const BadgeCard = ({
  id,
  title,
  description,
  onClick,
  message,
  disabled,
  variant,
  user
}) => {
  return (
    <Box key={id} mb={2}>
      <Card
        variant="outlined"
        sx={{
          mt: "10px",
          width: "100%",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)"
          }
        }}
      >
        <CardContent>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            marginTop="5px"
            marginBottom="5px"
            textAlign="justify"
          >
            {user}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            marginTop="10px"
            marginBottom="5px"
            textAlign="justify"
            sx={{ wordWrap: "break-word" }}
          >
            {description}
          </Typography>

          <Button
            variant={variant}
            size="small"
            onClick={onClick}
            sx={{ mt: "20px" }}
            disabled={disabled}
          >
            {message}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BadgeCard;
