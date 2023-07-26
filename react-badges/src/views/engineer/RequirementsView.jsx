import React from "react";
import { Typography, Button } from "@mui/material";
import RequirementAccordion from "../../components/ComponentsEngineer/RequirementAccordion";
import EvidenceForm from "../../components/ComponentsEngineer/EvidenceForm";
import EvidenceTable from "../../components/ComponentsEngineer/EvidenceTable";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import CustomSnackbar from "../../components/ComponentsEngineer/SnackBarAlert";

const RequirementsView = ({
  forms,
  showEvidences,
  editIndex,
  showSkeleton,
  errors_ev,
  handleSubmit_ev,
  onSubmit_ev,
  handleEvidenceEdit,
  handleEvidenceDelete,
  handleIssueRequest,
  register,
  setEditIndex,
  errorSnackbar,
  setErrorSnackbar
}) => {
  console.log("forms", forms);
  return (
    <BasicPage fullpage title="Requirements">
      {forms.map(({ req, control, handleSubmit, errors, onSubmit }, index) => (
        <React.Fragment key={req.id}>
          <RequirementAccordion req={req}>
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Typography
                variant="body2"
                color="grey"
                marginBottom="10px"
                style={{ marginTop: "5px" }}
              >
                {req.description}
              </Typography>

              <EvidenceForm
                reqId={req.id}
                control={control}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
              />

              <EvidenceTable
                reqId={req.id}
                showSkeleton={showSkeleton}
                showEvidences={showEvidences}
                editIndex={editIndex}
                handleEvidenceEdit={handleEvidenceEdit}
                handleEvidenceDelete={handleEvidenceDelete}
                handleSubmit_ev={handleSubmit_ev}
                onSubmit_ev={onSubmit_ev}
                register={register}
                errors_ev={errors_ev}
                setEditIndex={setEditIndex}
              />
            </div>
          </RequirementAccordion>
        </React.Fragment>
      ))}
      <Button
        variant="contained"
        size="small"
        onClick={handleIssueRequest}
        style={{ margin: "20px auto 0", display: "block" }}
      >
        Issue Request
      </Button>
      {errorSnackbar && (
        <CustomSnackbar
          open={errorSnackbar}
          onClose={() => setErrorSnackbar(false)}
          severity="error"
          message="Please fill evidences!"
        />
      )}
    </BasicPage>
  );
};

export default RequirementsView;
