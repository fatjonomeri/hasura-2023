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
  query MyQuery($engineerId: Int!, $id: Int!) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, id: { _eq: $id } }
    ) {
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
  const [requestId, setRequestId] = useState("");

  const { loading, error, data } = useQuery(GET_APPROVED_BADGES);
  console.log("data", data);

  useEffect(() => {
    if (data) {
      setRequestId(data?.issuing_requests[0]?.request_id);
    }
  }, [data]);

  const r8 = useQuery(GET_ACQUIRED_BADGES, {
    variables: {
      engineerId: user_id,
      id: requestId
    }
  });
  console.log("r8", r8);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <BasicPage fullpage title="Your Badges" subtitle="Engineer">
       <Typography variant="body1" gutterBottom sx={{marginTop: "10px"}}>
          
       These are the list of all the badges you have successfully acquired so far. Each badge represents a significant milestone in your professional journey, reflecting your dedication, expertise, and continuous pursuit of excellence.
           </Typography>
      {r8.data?.badge_candidature_view?.length === 0 ||
      r8.data?.badge_candidature_view?.length === undefined ? (
        <p>No acquired badges found.</p>
      ) : (
        r8.data?.badge_candidature_view?.map((badge) => (
          <Accordion
            key={badge.id}
            sx={{ marginTop: "12px", marginBottom: "12px" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h4">{badge.badge_title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body3">{badge.badge_description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </BasicPage>
  );
};

export default AcquiredBadges;
