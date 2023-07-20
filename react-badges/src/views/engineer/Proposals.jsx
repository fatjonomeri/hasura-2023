import React, { useContext, useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Modal,
  Typography,
  Box,
  Grid,
  Container,
  Alert
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";

const GET_PROPOSALS_CANDIDATURE = gql`
  mutation MyMutation($engineerId: Int!) {
    get_pending_proposals_for_manager(args: { engineerid: $engineerId }) {
      proposal_description
      badge_id
      id
      user {
        name
      }
      badges_version {
        title
        requirements
      }
    }
  }
`;

const ACCEPT_PROPOSAL = gql`
  mutation MyMutation(
    $proposal_id: Int!
    $created_by: Int!
    $disapproval_motivation: String!
    $is_approved: Boolean!
  ) {
    insert_engineer_badge_candidature_proposal_response(
      objects: {
        proposal_id: $proposal_id
        created_by: $created_by
        disapproval_motivation: $disapproval_motivation
        is_approved: $is_approved
      }
    ) {
      affected_rows
    }
  }
`;

const Proposals = () => {
  const { user_id } = useContext(AuthContext);
  const [acceptProposal] = useMutation(ACCEPT_PROPOSAL);
  const [motivation, setMotivation] = useState("");
  const [showMotivation, setShowMotivation] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposals, setProposals] = useState([]);

  const [getAvailableProposals, { loading, error, data }] = useMutation(
    GET_PROPOSALS_CANDIDATURE,
    { variables: { engineerId: user_id } }
  );

  useEffect(() => {
    getAvailableProposals();
  }, [getAvailableProposals]);

  useEffect(() => {
    if (data) {
      setProposals(data.get_pending_proposals_for_manager);
    }
  }, [data]);

  const handleAcceptProposal = async (proposalId) => {
    try {
      await acceptProposal({
        variables: {
          proposal_id: proposalId,
          created_by: user_id,
          is_approved: true,
          disapproval_motivation: null
        }
      });
      handleCloseModal();
      setProposals((prevProposals) =>
        prevProposals.filter((proposal) => proposal.id !== proposalId)
      );
    } catch (error) {
      console.error("Accept proposal error:", error);
    }
  };

  const handleDeclineProposal = (proposalId) => {
    setSelectedProposal(proposalId);
    setShowMotivation(true);
  };

  const handleMotivationChange = (event) => {
    setMotivation(event.target.value);
  };

  const handleConfirmDecline = async () => {
    try {
      await acceptProposal({
        variables: {
          proposal_id: selectedProposal,
          is_approved: false,
          created_by: user_id,
          disapproval_motivation: motivation
        }
      });
      setShowMotivation(false);
      setSelectedProposal(null);
      setMotivation("");
      handleCloseModal();
      setProposals((prevProposals) =>
        prevProposals.filter((proposal) => proposal.id !== selectedProposal)
      );
    } catch (error) {
      console.error("Decline proposal error:", error);
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (proposalId) => {
    setSelectedProposal(proposalId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (loading) return "Loading...";
  if (error) return `Error: ${error.message}`;

  return (
    <BasicPage fullpage title="Candidature Proposals" subtitle="Engineer">
      <Container>
        {proposals.length === 0 ? (
          <Alert severity="info" sx={{ fontSize: "1.2rem", marginTop: "5px" }}>
            No available proposals!
          </Alert>
        ) : (
          proposals.map((badge, index) => (
            <Card key={badge.id} sx={{ mt: 1 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {badge.badges_version.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", color: "grey" }}
                >
                  From: {badge.user.name}
                </Typography>
                <Typography variant="body1">
                  {badge.proposal_description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModal(badge.id)}
                  >
                    View Requirements
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Container>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            minWidth: 300
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
          {selectedProposal && (
            <>
              <Typography variant="h5" gutterBottom>
                {
                  proposals.find((proposal) => proposal.id === selectedProposal)
                    ?.badges_version.title
                }
              </Typography>
              <Typography variant="body1" gutterBottom>
                Requirements:
              </Typography>
              <ul>
                {proposals
                  .find((proposal) => proposal.id === selectedProposal)
                  ?.badges_version.requirements.map((req) => (
                    <li key={req.id}>
                      <Typography variant="body2">{req.description}</Typography>
                    </li>
                  ))}
              </ul>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleAcceptProposal(selectedProposal)}
                  >
                    Accept
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleDeclineProposal(selectedProposal)}
                  >
                    Decline
                  </Button>
                </Grid>
                {showMotivation && selectedProposal && (
                  <Grid
                    container
                    spacing={2}
                    sx={{ mt: 2, alignItems: "center" }}
                  >
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        label="Motivation for Decline"
                        value={motivation}
                        onChange={handleMotivationChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant="contained"
                        onClick={handleConfirmDecline}
                        sx={{
                          height: "100%",
                          minWidth: "80px",
                          mt: 1,
                          display: "flex",
                          justifyContent: "center"
                        }}
                        size="small"
                      >
                        Confirm Decline
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Box>
      </Modal>
    </BasicPage>
  );
};

export default Proposals;
