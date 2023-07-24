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
  Stack,
  Divider
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

const ACCEPTED_DECLINED_PROPOSALS = gql`
  query MyQuery($engineerId: Int!, $is_approved: Boolean!) {
    manager_badge_candidature_proposal_response(
      where: {
        engineer_to_manager_badge_candidature_proposal: {
          created_by: { _eq: $engineerId }
        }
        is_approved: { _eq: $is_approved }
      }
    ) {
      engineer_to_manager_badge_candidature_proposal {
        badges_version {
          title
          description
        }
        user {
          name
        }
        proposal_description
      }
    }
  }
`;

const PendingProposals = () => {
  const { user_id } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [selectedProposalType, setSelectedProposalType] = useState("pending");

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

  const {
    loading: approvedLoading,
    error: approvedError,
    data: approvedData
  } = useQuery(ACCEPTED_DECLINED_PROPOSALS, {
    variables: {
      engineerId: user_id,
      is_approved: true
    }
  });

  const {
    loading: rejectedLoading,
    error: rejectedError,
    data: rejectedData
  } = useQuery(ACCEPTED_DECLINED_PROPOSALS, {
    variables: {
      engineerId: user_id,
      is_approved: false
    }
  });

  console.log(
    "rejectedData",
    rejectedData?.manager_badge_candidature_proposal_response
  );

  if (loading) return "Loading...";
  if (error) return `Error: ${error.message}`;

  return (
    <BasicPage fullpage title="Pending Proposals" subtitle="Engineer">
      <br />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <Button onClick={() => setSelectedProposalType("pending")}>
          Pending proposals
        </Button>
        <Button onClick={() => setSelectedProposalType("approved")}>
          Accepted proposals
        </Button>
        <Button onClick={() => setSelectedProposalType("rejected")}>
          Declined proposals
        </Button>
      </Stack>

      {selectedProposalType === "pending" &&
      data?.get_pending_proposals_for_engineer?.length === 0 ? (
        <Alert severity="info">No pending badges!</Alert>
      ) : selectedProposalType === "pending" ? (
        <Box mt={2}>
          {data?.get_pending_proposals_for_engineer?.map((badge) => (
            <Accordion key={badge.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h3">
                  {badge.badges_version.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  {" "}
                  Proposal description: {badge.proposal_description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : selectedProposalType === "approved" ? (
        approvedData?.manager_badge_candidature_proposal_response.map(
          (proposal, index) => (
            <Accordion
              key={
                proposal.engineer_to_manager_badge_candidature_proposal
                  .badges_version.title
              }
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h3">
                  {
                    proposal.engineer_to_manager_badge_candidature_proposal
                      .badges_version.title
                  }
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  {" "}
                  Proposal description:{" "}
                  {
                    proposal.engineer_to_manager_badge_candidature_proposal
                      .proposal_description
                  }
                </Typography>
              </AccordionDetails>
            </Accordion>
          )
        )
      ) : (
        rejectedData?.manager_badge_candidature_proposal_response.map(
          (proposal, index) => (
            <Accordion
              key={
                proposal.engineer_to_manager_badge_candidature_proposal
                  .badges_version.title
              }
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h3">
                  {
                    proposal.engineer_to_manager_badge_candidature_proposal
                      .badges_version.title
                  }
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  {" "}
                  Proposal description:{" "}
                  {
                    proposal.engineer_to_manager_badge_candidature_proposal
                      .proposal_description
                  }
                </Typography>
              </AccordionDetails>
            </Accordion>
          )
        )
      )}

      <hr />
    </BasicPage>
  );
};

export default PendingProposals;
