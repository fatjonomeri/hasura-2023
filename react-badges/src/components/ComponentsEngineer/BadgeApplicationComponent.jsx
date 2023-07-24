import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  TextField,
  Button,
  Typography
} from "@mui/material";
import AutocompleteController from "./AutocompleteController";

const BadgeApplicationDialog = ({
  open,
  onClose,
  onSubmit,
  options,
  isManagerListEmpty,
  selectedManager,
  setSelectedManager,
  register,
  errors,
  control
}) => {
  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle variant="h2" fontWeight="bold">
        Confirm Application
        <Typography variant="body2" marginTop="5px">
          Write a motivation description for the badge you are applying and
          select the manager you are sending this application to.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <FormGroup sx={{ marginBottom: "10px" }}>
            <AutocompleteController
              control={control}
              name="manager"
              rules={{ required: "Manager is required." }}
              options={options}
              label="Select Manager"
              isManagerListEmpty={isManagerListEmpty}
              errors={errors}
              setSelectedManager={setSelectedManager}
              selectedManager={selectedManager}
            />
          </FormGroup>
          <FormGroup>
            <TextField
              {...register("motivationDescription", {
                required: "Motivation Description is required.",
                maxLength: {
                  value: 255,
                  message:
                    "Motivation Description must be at most 255 characters."
                }
              })}
              id="outlined-basic-description"
              label="Motivation Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              error={!!errors.motivationDescription}
              helperText={errors.motivationDescription?.message}
            />
          </FormGroup>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="submit" variant="contained">
              Confirm Application
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeApplicationDialog;
