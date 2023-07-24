import React, { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
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
  Snackbar,
  Stack,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { useForm, Controller } from "react-hook-form";
import CenteredLayout from "../../layouts/CenteredLayout";
import LoadableCurtain from "../../components/LoadableCurtain";

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

const ACCEPTED_DECLINED_PROPOSALS = gql`
  query MyQuery($engineerId: Int!, $is_approved: Boolean!) {
    engineer_badge_candidature_proposal_response(
      where: {
        created_by: { _eq: $engineerId }
        is_approved: { _eq: $is_approved }
      }
    ) {
      manager_to_engineer_badge_candidature_proposal {
        badges_version {
          title
          description
        }
        user {
          name
        }
        proposal_description
      }
      disapproval_motivation
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
  const [selectedProposalType, setSelectedProposalType] = useState("pending");

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

  const handleAcceptProposal = async (proposalId) => {
    try {
      await acceptProposal({
        variables: {
          proposal_id: proposalId,
          created_by: user_id,
          disapproval_motivation: null,
          is_approved: true
        },
        refetchQueries: [
          {
            query: ACCEPTED_DECLINED_PROPOSALS,
            variables: { engineerId: user_id, is_approved: true }
          }
        ]
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
        },
        refetchQueries: [
          {
            query: ACCEPTED_DECLINED_PROPOSALS,
            variables: { engineerId: user_id, is_approved: false }
          }
        ]
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

  if (loading) {
    return (
      <CenteredLayout>
        <LoadableCurtain text="Proposals" />
      </CenteredLayout>
    );
  }
  if (error) return `Error: ${error.message}`;

  console.log("rejected ", rejectedData);

  return (
    <BasicPage fullpage title="Candidature Proposals" subtitle="Engineer">
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

      {selectedProposalType === "pending" && proposals.length === 0 ? (
        <Alert severity="info">No available proposals!</Alert>
      ) : selectedProposalType === "pending" ? (
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
      ) : selectedProposalType === "approved" ? (
        // Render approved proposal cards
        approvedData?.engineer_badge_candidature_proposal_response.map(
          (proposal, index) => (
            <Card key={index} sx={{ mt: 1 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {
                    proposal.manager_to_engineer_badge_candidature_proposal
                      .badges_version.title
                  }
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", color: "grey" }}
                >
                  From:{" "}
                  {
                    proposal.manager_to_engineer_badge_candidature_proposal.user
                      .name
                  }
                </Typography>
                <Typography variant="body1">
                  {
                    proposal.manager_to_engineer_badge_candidature_proposal
                      .proposal_description
                  }
                </Typography>
                {/* Render other card content */}
              </CardContent>
            </Card>
          )
        )
      ) : (
        // Render rejected proposal cards
        rejectedData?.engineer_badge_candidature_proposal_response.map(
          (proposal, index) => (
            <Card key={index} sx={{ mt: 1 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {
                    proposal.manager_to_engineer_badge_candidature_proposal
                      .badges_version.title
                  }
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", color: "grey" }}
                >
                  From:{" "}
                  {
                    proposal.manager_to_engineer_badge_candidature_proposal.user
                      .name
                  }
                </Typography>
                <Typography variant="body1">
                  {
                    proposal.manager_to_engineer_badge_candidature_proposal
                      .proposal_description
                  }
                </Typography>
                {/* Render other card content */}
              </CardContent>
            </Card>
          )
        )
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
