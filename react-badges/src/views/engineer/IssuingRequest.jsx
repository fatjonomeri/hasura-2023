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
  const navigate = useNavigate();
  //const [candidatures, setCandidatures] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_CANDIDATURES, {
    variables: { engineerId: user_id },
    fetchPolicy: "network-only"
  });

  // useEffect(() => {
  //   refetch().then((r) => console.log("rrr", r));
  // }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("data", data);

  const candidatures = data.badge_candidature_view;

  const handleViewRequirements = (requestID) => {
    console.log("reqid before", requestID);
    navigate(`requirements/${requestID}`);
  };

  return (
    <BasicPage fullpage title="Submit An Issuing Request" subtitle="Engineer">
      <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
        Here, you can review the candidature proposals you have submitted for
        manager review. If you have gathered all the required evidence for your
        candidature proposal and are satisfied with your submission, you can
        proceed with submitting your issue request.
      </Typography>
      {candidatures.map((item, index) => (
        <Box key={item.badge_id} mb={2}>
          <Card variant="outlined" sx={{ mt: "10px" }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {item.badge_title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="5px"
                marginBottom="5px"
              >
                {item.badge_description}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleViewRequirements(item.id)}
              >
                View Requirements
              </Button>
            </CardContent>
          </Card>
        </Box>
      ))}
    </BasicPage>
  );
};

export default IssuingRequest;
