import React from "react";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const AutocompleteController = ({
  control,
  name,
  rules,
  options,
  label,
  isManagerListEmpty,
  errors,
  setSelectedManager,
  selectedManager
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Autocomplete
          {...field}
          sx={{ mt: "8px" }}
          options={options}
          value={selectedManager}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            setSelectedManager(value);
            field.onChange(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              disabled={isManagerListEmpty}
              error={!!errors[name]}
              helperText={errors[name]?.message}
              fullWidth
            />
          )}
        />
      )}
    />
  );
};

export default AutocompleteController;
