import React, { useContext, useEffect, useState } from "react";
import {
  gql,
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery
} from "@apollo/client";
import { GET_CANDIDATURES } from "../../state/GraphQL/Queries/Queries";
import { Link, useNavigate } from "react-router-dom";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import BadgeCard from "../../components/ComponentsEngineer/BadgeCard";
import LoadableCurtain from "../../components/LoadableCurtain";
import CenteredLayout from "../../layouts/CenteredLayout";
import { useLocation } from "react-router-dom";
import SnackBarAlert from "../../components/ComponentsEngineer/SnackBarAlert";
import InfoAlert from "../../components/ComponentsEngineer/Alert";

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

const GET_CANDIDATURES_F = gql`
  query MyQuery($id: Int!) {
    badge_candidature_view(where: { id: { _eq: $id } }) {
      badge_requirements
      id
      engineer_name
      badge_title
      badge_description
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
    <BasicPage fullpage title="Submit An Issuing Request" subtitle="Engineer">
      <br />
      {candidatures.length === 0 ? (
        <InfoAlert
          message={`You don't have any issuing requests at the moment!`}
        />
      ) : (
        candidatures.map((item, index) => (
          <BadgeCard
            key={item.badge_id}
            id={item.badge_id}
            title={item.badge_title}
            description={item.badge_description}
            onClick={() => handleViewRequirements(item.id)}
            message={"View Requirements"}
            disabled={false}
            variant={"outlined"}
          />
        ))
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
