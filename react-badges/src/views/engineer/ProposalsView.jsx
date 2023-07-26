import React from "react";
import { Grid, Typography, Modal, Box, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BadgeCard from "../../components/ComponentsEngineer/BadgeCard";
// import CenteredLayout from "../../layouts/CenteredLayout";
// import LoadableCurtain from "../../components/LoadableCurtain";
import InfoAlert from "../../components/ComponentsEngineer/Alert";
import CustomSnackbar from "../../components/ComponentsEngineer/SnackBarAlert";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { Controller } from "react-hook-form";

const ProposalsView = ({
  proposals,
  handleAcceptProposal,
  handleDeclineProposal,
  handleOpenModal,
  handleCloseModal,
  handleSnackbarClose,
  onSubmit,
  selectedProposal,
  showMotivation,
  motivation,
  handleMotivationChange,
  control,
  errors,
  loading,
  openModal,
  handleSubmit,
  acceptSnackbarOpen,
  declineSnackbarOpen
}) => {



  return (
    <BasicPage
      fullpage
      title="Candidature Proposals From Managers"
    >
      <Typography
       variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
        You have received candidature proposals from your managers. Please take
        the time to review each proposal carefully and proceed with the
        appropriate action.
      </Typography>
      {proposals.length === 0 ? (
        <InfoAlert message={` No available proposals!`} />
      ) : (
        <Grid container spacing={2}>
          {proposals.map((badge, index) => (
            <Grid item xs={12} sm={6} md={4} key={badge.id}>
              <BadgeCard
                title={badge.badges_version.title}
                user={`From: ${badge.user.name}`}
                description={badge.proposal_description}
                onClick={() => handleOpenModal(badge.id)}
                message="View Requirements"
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
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
      
      <CustomSnackbar
        open={acceptSnackbarOpen}
        onClose={handleSnackbarClose}
        severity="success"
        message="You have accepted the proposal!"
      />

      <CustomSnackbar
        open={declineSnackbarOpen}
        onClose={handleSnackbarClose}
        severity="success"
        message="You have declined the proposal!"
      />
    </BasicPage>
  );
};

export default ProposalsView;
