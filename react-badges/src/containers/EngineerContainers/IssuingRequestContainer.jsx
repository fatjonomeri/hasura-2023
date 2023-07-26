import React, { useContext, useEffect, useState } from "react";
import { gql, useQuery, useApolloClient, useLazyQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import {
  GET_CANDIDATURES,
  GET_REQUIREMENTS
} from "../../state/GraphQL/Queries/Queries";
import IssuingRequestView from "../../views/engineer/IssuingRequestView";
import LoadableCurtain from "../../components/LoadableCurtain";
import CenteredLayout from "../../layouts/CenteredLayout";

const IssuingRequestContainer = () => {
  const { user_id } = useContext(AuthContext);
  const [snack, setSnack] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const { loading, error, data, refetch } = useQuery(GET_CANDIDATURES, {
    variables: { engineerId: user_id },
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (state) {
      setSnack(state.snack);
    }
    refetch();
  }, []);

  const [get_requirements] = useLazyQuery(GET_REQUIREMENTS);

  const handleViewRequirements = async (requestID) => {
    const r = await get_requirements({
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

  const candidatures = data?.badge_candidature_view || [];

  return (
    <IssuingRequestView
      candidatures={candidatures}
      handleViewRequirements={handleViewRequirements}
      snack={snack}
      setSnack={setSnack}
    />
  );
};

export default IssuingRequestContainer;
