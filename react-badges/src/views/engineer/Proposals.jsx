import React, { useContext, useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { useForm, Controller } from "react-hook-form";

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
  const [openModal, setOpenModal] = useState(false);
  const [acceptSnackbarOpen, setAcceptSnackbarOpen] = useState(false);
  const [declineSnackbarOpen, setDeclineSnackbarOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "onChange"
  });

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
      setAcceptSnackbarOpen(true);
    } catch (error) {
      console.error("Accept proposal error:", error);
    }
  };

  const handleDeclineProposal = (proposalId) => {
    setSelectedProposal(proposalId);
    setShowMotivation(true);
  };

  const handleMotivationChange = (value) => {
    setMotivation(value);
  };

  const onSubmit = async (data) => {
    try {
      await acceptProposal({
        variables: {
          proposal_id: selectedProposal,
          is_approved: false,
          created_by: user_id,
          disapproval_motivation: data.motivation
        }
      });
      setShowMotivation(false);
      setSelectedProposal(null);
      setMotivation("");
      handleCloseModal();
      setProposals((prevProposals) =>
        prevProposals.filter((proposal) => proposal.id !== selectedProposal)
      );
      setDeclineSnackbarOpen(true);
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Decline proposal error:", error);
    }
  };

  const handleOpenModal = (proposalId) => {
    setSelectedProposal(proposalId);
    setShowMotivation(false); // Reset showMotivation state here
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset(); // Reset the form data when closing the modal
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAcceptSnackbarOpen(false);
    setDeclineSnackbarOpen(false);
  };

  if (loading) return "Loading...";
  if (error) return `Error: ${error.message}`;

  return (
    <BasicPage fullpage title="Candidature Proposals" subtitle="Engineer">
      <br />

      {proposals.length === 0 ? (
        <Alert severity="info">No available proposals!</Alert>
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                      <Controller
                        name="motivation"
                        control={control}
                        rules={{
                          required: "Motivation is required",
                          maxLength: {
                            value: 255,
                            message:
                              "Motivation description must be at most 255 characters long"
                          }
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            label="Motivation for Decline"
                            value={motivation}
                            onChange={(e) =>
                              handleMotivationChange(e.target.value)
                            }
                            size="small"
                            error={!!errors.motivation}
                            helperText={errors.motivation?.message}
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        type="submit"
                        variant="contained"
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
            </form>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={acceptSnackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          elevation={6}
          variant="filled"
        >
          You have accepted the proposal!
        </MuiAlert>
      </Snackbar>

      {/* Snackbar for Confirm Decline */}
      <Snackbar
        open={declineSnackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="error"
          elevation={6}
          variant="filled"
        >
          You have declined the proposal!
        </MuiAlert>
      </Snackbar>
    </BasicPage>
  );
};

export default Proposals;
