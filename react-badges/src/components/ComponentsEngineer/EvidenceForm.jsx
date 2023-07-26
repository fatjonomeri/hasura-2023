import React from "react";
import { Button, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const EvidenceForm = ({ reqId, control, handleSubmit, errors, onSubmit }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <form
        onSubmit={handleSubmit((data) => onSubmit(data, reqId))}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Controller
          name={`evidenceDescription_${reqId}`}
          control={control}
          rules={{ required: `Evidence is required` }}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                id={`evidence_${reqId}`}
                label="Evidence Description"
                variant="standard"
                style={{ marginBottom: "10px" }}
                helperText={
                  errors?.[`evidenceDescription_${reqId}`]?.message || ""
                }
                error={Boolean(errors?.[`evidenceDescription_${reqId}`])}
              />
            </>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
};

export default EvidenceForm;
