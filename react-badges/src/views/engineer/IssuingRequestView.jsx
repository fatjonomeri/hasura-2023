import React from "react";
import { Grid, Typography } from "@mui/material";
import BadgeCard from "../../components/ComponentsEngineer/BadgeCard";
import LoadableCurtain from "../../components/LoadableCurtain";
import CenteredLayout from "../../layouts/CenteredLayout";
import SnackBarAlert from "../../components/ComponentsEngineer/SnackBarAlert";
import InfoAlert from "../../components/ComponentsEngineer/Alert";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import CustomSnackbar from "../../components/ComponentsEngineer/SnackBarAlert";

const IssuingRequestView = ({
  candidatures,
  handleViewRequirements,
  snack,
  setSnack
}) => {
  return (
    <BasicPage fullpage title="Submit An Issuing Request">
      <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
        Here, you can review the candidature proposals you have submitted for
        manager review. If you have gathered all the required evidence for your
        candidature proposal and are satisfied with your submission, you can
        proceed with submitting your issue request.
      </Typography>
      {candidatures.length === 0 ? (
        <InfoAlert
          message={`You don't have any issuing requests at the moment!`}
        />
      ) : (
        <Grid container spacing={2}>
          {candidatures.map((badge, index) => (
            <Grid item xs={12} sm={6} md={4} key={badge.id}>
              <BadgeCard
                badge={badge}
                title={badge.badge_title}
                description={badge.badge_description}
                onClick={() => handleViewRequirements(badge.id)}
                message={"View Requirements"}
                disabled={false}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      )}
      {snack && (
        <CustomSnackbar
          open={snack}
          onClose={() => setSnack(false)}
          severity="success"
          message="Your issue request was successful!"
        />
      )}
    </BasicPage>
  );
};

export default IssuingRequestView;
