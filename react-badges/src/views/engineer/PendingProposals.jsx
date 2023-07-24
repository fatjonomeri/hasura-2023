import { useContext, useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  TextField,
  FormGroup,
  Button,
  Select,
  MenuItem,
  Alert,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,

} from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";    
import { AuthContext } from "../../state/with-auth";

const GET_PENDING_PROPOSALS = gql`
  mutation MyMutation($engineerId: Int!) {
    get_pending_proposals_for_engineer(args: { engineerid: $engineerId }) {
      badge_id
      id
      proposal_description
      badges_version {
        title
      }
    }
  }
`;

const PendingProposals = () => {
  const { user_id } = useContext(AuthContext);
  const [pendingProposals, setPendingProposals] = useState([]);

  const [getProposals, { loading, error, data }] = useMutation(
    GET_PENDING_PROPOSALS,
    { variables: { engineerId: user_id } }
  );

  useEffect(() => {
    getProposals();
  }, [getProposals]);

  useEffect(() => {
    if (data) {
      setPendingProposals(data?.get_pending_proposals_for_engineer || []);
    }
  }, [data]);

  if (loading) return "Loading...";
  if (error) return `Error: ${error.message}`;

  return (
    <BasicPage fullpage title="Pending Applications" subtitle="Engineer">
       <Typography variant="body1" gutterBottom sx={{marginTop: "10px"}}>
          
       You have submitted candidature proposals for review by your managers. Currently, these proposals are pending manager responses. We kindly request your patience as the managers carefully consider each application. Once the managers respond, you will be notified of their decision.
        </Typography>
    {pendingProposals.length === 0 && (
      <Alert severity="info">No pending badges!</Alert>
    )}
    <Box mt={2}>
      {pendingProposals.map((badge) => (
        <Accordion key={badge.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h3">{badge.badges_version.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              Proposal description: {badge.proposal_description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
    <hr />
  </BasicPage>
  );
};

export default PendingProposals;



