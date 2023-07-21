import React, { useContext, useEffect, useState } from "react";
import {
  gql,
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery
} from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import BadgeCard from "../../components/engineerComponents/BadgeCard";
import LoadableCurtain from "../../components/LoadableCurtain";
import CenteredLayout from "../../layouts/CenteredLayout";
import { useLocation } from "react-router-dom";
import SnackBarAlert from "../../components/engineerComponents/SnackBarAlert";

const GET_CANDIDATURES = gql`
  query MyQuery($engineerId: Int!) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, is_issued: { _eq: false } }
    ) {
      id
      badge_id
      badge_title
      badge_description
      is_issued
    }
  }
`;

const IssuingRequest = () => {
  const { user_id } = useContext(AuthContext);
  const [snack, setSnack] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const { loading, error, data, refetch } = useQuery(GET_CANDIDATURES, {
    variables: { engineerId: user_id },
    fetchPolicy: "network-only"
  });

  console.log("loc", state);
  useEffect(() => {
    // Check if the 'snack' property exists in the state
    if (state && state.snack) {
      // Show the snackbar here
      console.log("Show Snackbar!");
      setSnack(true);
    }
  }, [state]);

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

  const handleViewRequirements = (requestID) => {
    navigate(`requirements/${requestID}`);
  };

  return (
    <BasicPage fullpage title="Submit An Issuing Request" subtitle="Engineer">
      {candidatures.map((item, index) => (
        <BadgeCard
          id={item.badge_id}
          title={item.badge_title}
          description={item.badge_description}
          onClick={() => handleViewRequirements(item.id)}
          message={"View Requirements"}
          disabled={false}
          variant={"outlined"}
        />
      ))}
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
