import { useContext, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  GET_REQUEST_ID,
  GET_ACQUIRED_BADGES
} from "../../state/GraphQL/Queries/Queries";
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

const AcquiredBadges = () => {
  const { user_id } = useContext(AuthContext);
  const [requestId, setRequestId] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_REQUEST_ID);

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

  useEffect(() => {
    refetch();
    refetchAcquiredBadges();
  }, [acquiredBadgesData]);

  console.log("acquiredBadges", acquiredBadgesData);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  console.log("data", data?.issuing_requests);

  return (
    <BasicPage fullpage title="Your Badges" subtitle="Engineer">
      <>
        <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
          These are the list of all the badges you have successfully acquired so
          far. Each badge represents a significant milestone in your
          professional journey, reflecting your dedication, expertise, and
          continuous pursuit of excellence.
        </Typography>
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