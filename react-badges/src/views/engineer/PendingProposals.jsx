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
  const [proposals, setProposals] = useState([]);

  const [getProposals, { loading, error, data }] = useMutation(
    GET_PENDING_PROPOSALS
  );

  const fetchData = async () => {
    const { data } = await getProposals({
      variables: {
        engineerId: user_id
      }
    });
    console.log(data.get_pending_proposals_for_engineer);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return "Loading...";
  if (error) return `Error: ${error.message}`;

  return (
    <BasicPage fullpage title="Pending Proposals" subtitle="Engineer">
      {data?.get_pending_proposals_for_engineer &&
        data?.get_pending_proposals_for_engineer.length === 0 && (
          <Alert severity="info">No pending badges!</Alert>
        )}
      <Box mt={2}>
        {data?.get_pending_proposals_for_engineer?.map((badge) => (
          <Accordion key={badge.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h3">{badge.badges_version.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1"> Proposal description: {badge.proposal_description}
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


//comment
