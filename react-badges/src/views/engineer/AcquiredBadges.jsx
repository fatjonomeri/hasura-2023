import { useContext, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  TextField,
  FormGroup,
  Button,
  Select,
  MenuItem,
  Alert,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails
} from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const GET_APPROVED_BADGES = gql`
  query MyQuery {
    issuing_requests(where: { is_approved: { _eq: true } }) {
      request_id
    }
  }
`;

const GET_ACQUIRED_BADGES = gql`
  query MyQuery($engineerId: Int!, $id: [Int!]) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, id: { _in: $id } }
    ) {
      id
      badge_title
      candidature_evidences
      badge_description
      engineer_name
      engineer_id
    }
  }
`;

const AcquiredBadges = () => {
  const { user_id } = useContext(AuthContext);
  const [requestId, setRequestId] = useState([]);

  const { loading, error, data } = useQuery(GET_APPROVED_BADGES);

  useEffect(() => {
    const arr = [];
    if (data) {
      data?.issuing_requests.map((d) => {
        arr.push(d.request_id);
      });
    }
    setRequestId(arr);
  }, [data]);

  const { data: acquiredBadgesData, refetch: refetchAcquiredBadges } = useQuery(
    GET_ACQUIRED_BADGES,
    {
      variables: {
        engineerId: user_id,
        id: requestId
      }
    }
  );
  console.log("acquiredBadges", acquiredBadgesData);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  console.log("data", data?.issuing_requests);

  return (
    <BasicPage fullpage title="Your Badges" subtitle="Engineer">
      <br />
      <>
        {acquiredBadgesData?.badge_candidature_view?.length === 0 ? (
          <Alert severity="info" sx={{ marginBottom: "12px" }}>
            You don't have any badge!
          </Alert>
        ) : (
          acquiredBadgesData?.badge_candidature_view?.map((badge) => (
            <Accordion
              key={badge.id}
              sx={{ marginTop: "12px", marginBottom: "12px" }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4">{badge.badge_title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body3">
                  {badge.badge_description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </>
    </BasicPage>
  );
};

export default AcquiredBadges;
