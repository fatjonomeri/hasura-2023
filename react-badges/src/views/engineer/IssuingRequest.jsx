import React, { useContext, useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_CANDIDATURES,
  GET_CANDIDATURES_F
} from "../../state/GraphQL/Queries/Queries";
import { useNavigate } from "react-router-dom";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { Grid, Typography } from "@mui/material";
import BadgeCard from "../../components/ComponentsEngineer/BadgeCard";
import LoadableCurtain from "../../components/LoadableCurtain";
import CenteredLayout from "../../layouts/CenteredLayout";
import { useLocation } from "react-router-dom";
import SnackBarAlert from "../../components/ComponentsEngineer/SnackBarAlert";
import InfoAlert from "../../components/ComponentsEngineer/Alert";

const IssuingRequest = () => {
  const { user_id } = useContext(AuthContext);
  const [snack, setSnack] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const { loading, error, data, refetch } = useQuery(GET_CANDIDATURES, {
    variables: { engineerId: user_id },
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    refetch();
  }, []);

  const [get_f, { data: r_data, refetch: r_refetch }] =
    useLazyQuery(GET_CANDIDATURES_F);

  const handleViewRequirements = async (requestID) => {
    const r = await get_f({
      variables: { id: requestID }
    });
    console.log("r_data", r.data.badge_candidature_view[0].badge_requirements);
    navigate(`requirements/${requestID}`, {
      state: r.data.badge_candidature_view[0].badge_requirements
    });
  };

  if (loading) {
    return (
      <CenteredLayout>
        <LoadableCurtain text="Issuing Requests" />
      </CenteredLayout>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const candidatures = data.badge_candidature_view;

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
        <SnackBarAlert
          open={snack}
          onClose={() => setSnack(false)}
          severity={"success"}
          message={"View"}
        />
      )}
    </BasicPage>
  );
};

export default IssuingRequest;
