import React from "react";
import {
  Button,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import EvidenceSkeleton from "./EvidenceSkeleton";

const EvidenceTable = ({
  reqId,
  showSkeleton,
  showEvidences,
  editIndex,
  handleEvidenceEdit,
  handleEvidenceDelete,
  handleSubmit_ev,
  onSubmit_ev,
  register,
  errors_ev,
  setEditIndex
}) => {
  return (
    <Table>
      {showEvidences &&
        showEvidences.filter((evidence) => evidence.reqId === reqId).length >
          0 && (
          <TableHead>
            <TableRow>
              <TableCell>Evidence</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
        )}
      <TableBody>
        {showSkeleton ? (
          // Display skeleton while loading
          <TableRow key={reqId}>
            <TableCell>
              <EvidenceSkeleton />
            </TableCell>
            <TableCell>
              <EvidenceSkeleton />
            </TableCell>
            <TableCell>
              <EvidenceSkeleton />
            </TableCell>
          </TableRow>
        ) : (
          showEvidences &&
          showEvidences
            .filter((evidence) => evidence.reqId === reqId)
            .map((evidence, index) => (
              <TableRow key={evidence.id}>
                {editIndex === evidence.id ? (
                  <TableCell>
                    <form
                      id="evidence_form"
                      onSubmit={handleSubmit_ev((data) =>
                        onSubmit_ev(data, evidence.id)
                      )}
                    >
                      <TextField
                        {...register(`[${evidence.id}]`, {
                          required: true
                        })}
                        id={`evidence-description-${index}`}
                        variant="standard"
                        defaultValue={evidence.description}
                        error={!!errors_ev[evidence.id]}
                      />
                    </form>
                    {errors_ev[evidence.id] && (
                      <FormHelperText error>
                        This field is required
                      </FormHelperText>
                    )}
                  </TableCell>
                ) : (
                  <TableCell>{evidence.description}</TableCell>
                )}
                <TableCell>
                  {editIndex === evidence.id ? (
                    <>
                      <Button
                        type="submit"
                        form="evidence_form"
                        variant="outlined"
                        size="small"
                        color="success"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditIndex(null)}
                        variant="outlined"
                        size="small"
                        sx={{
                          marginLeft: "10px"
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        handleEvidenceEdit(evidence.id);
                      }}
                      variant="outlined"
                      size="small"
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEvidenceDelete(evidence.id)}
                    variant="outlined"
                    size="small"
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  );
};

export default EvidenceTable;
