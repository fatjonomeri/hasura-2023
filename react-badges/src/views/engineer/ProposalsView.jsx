<<<<<<< HEAD
import React from "react";
import { Grid, Typography, Modal, Box, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BadgeCard from "../../components/ComponentsEngineer/BadgeCard";
// import CenteredLayout from "../../layouts/CenteredLayout";
// import LoadableCurtain from "../../components/LoadableCurtain";

// import React, { useContext, useEffect, useState } from "react";
// import { useMutation } from "@apollo/client";
// import {
//   GET_PROPOSALS_CANDIDATURE,
//   PROPOSAL_RESPONSE
// } from "../../state/GraphQL/Mutations/Mutations";
// import {
//   TextField,
//   Button,
//   Modal,
//   Typography,
//   Box,
//   Grid,
//   Snackbar
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { IconButton } from "@mui/material";
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { AuthContext } from "../../state/with-auth";
// import { useForm, Controller } from "react-hook-form";
// import BadgeCard from "../../components/ComponentsEngineer/BadgeCard";
// import CenteredLayout from "../../layouts/CenteredLayout";
// import LoadableCurtain from "../../components/LoadableCurtain";
// import InfoAlert from "../../components/ComponentsEngineer/Alert";
// import CustomSnackbar from "../../components/ComponentsEngineer/SnackBarAlert";

// const Proposals = () => {
//   const { user_id } = useContext(AuthContext);
//   const [proposalResponse] = useMutation(PROPOSAL_RESPONSE);
//   const [motivation, setMotivation] = useState("");
//   const [showMotivation, setShowMotivation] = useState(false);
//   const [selectedProposal, setSelectedProposal] = useState(null);
//   const [proposals, setProposals] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [acceptSnackbarOpen, setAcceptSnackbarOpen] = useState(false);
//   const [declineSnackbarOpen, setDeclineSnackbarOpen] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset
//   } = useForm({
//     mode: "onChange"
//   });

//   const [getAvailableProposals, { loading, error, data }] = useMutation(
//     GET_PROPOSALS_CANDIDATURE,
//     { variables: { engineerId: user_id } }
//   );

//   useEffect(() => {
//     getAvailableProposals();
//   }, [getAvailableProposals]);

//   useEffect(() => {
//     if (data) {
//       setProposals(data.get_pending_proposals_for_manager);
//     }
//   }, [data]);

//   const handleAcceptProposal = async (proposalId) => {
//     try {
//       await proposalResponse({
//         variables: {
//           proposal_id: proposalId,
//           created_by: user_id,
//           is_approved: true,
//           disapproval_motivation: null
//         }
//       });
//       handleCloseModal();
//       setProposals((prevProposals) =>
//         prevProposals.filter((proposal) => proposal.id !== proposalId)
//       );
//       setAcceptSnackbarOpen(true);
//     } catch (error) {
//       console.error("Accept proposal error:", error);
//     }
//   };

//   const handleDeclineProposal = (proposalId) => {
//     setSelectedProposal(proposalId);
//     setShowMotivation(true);
//   };

//   const handleMotivationChange = (value) => {
//     setMotivation(value);
//   };

//   const onSubmit = async (data) => {
//     try {
//       await proposalResponse({
//         variables: {
//           proposal_id: selectedProposal,
//           is_approved: false,
//           created_by: user_id,
//           disapproval_motivation: data.motivation
//         }
//       });
//       setShowMotivation(false);
//       setSelectedProposal(null);
//       setMotivation("");
//       handleCloseModal();
//       setProposals((prevProposals) =>
//         prevProposals.filter((proposal) => proposal.id !== selectedProposal)
//       );
//       setDeclineSnackbarOpen(true);
//       reset(); // Reset form after successful submission
//     } catch (error) {
//       console.error("Decline proposal error:", error);
//     }
//   };

//   const handleOpenModal = (proposalId) => {
//     setSelectedProposal(proposalId);
//     setShowMotivation(false); // Reset showMotivation state here
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     reset(); // Reset the form data when closing the modal
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setAcceptSnackbarOpen(false);
//     setDeclineSnackbarOpen(false);
//   };

//   if (loading)
//     return (
//       <CenteredLayout>
//         <LoadableCurtain text="Cadidatures" />
//       </CenteredLayout>
//     );
//   if (error) return `Error: ${error.message}`;

//   return (
//     <BasicPage
//       fullpage
//       title="Candidature Proposals From Managers"
//       subtitle="Engineer"
//     >
//       <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
//         You have received candidature proposals from your managers. Please take
//         the time to review each proposal carefully and proceed with the
//         appropriate action.
//       </Typography>
//       {proposals.length === 0 ? (
//         <InfoAlert message={` No available proposals!`} />
//       ) : (
    
//         <Grid container spacing={2}>
//           {proposals.map((badge, index) => (
//             <Grid item xs={12} sm={6} md={4} key={badge.id}>
//               <BadgeCard
//                 title={badge.badges_version.title}
//                 user={`From: ${badge.user.name}`}
//                 description={badge.proposal_description}
//                 onClick={() => handleOpenModal(badge.id)}
//                 message="View Requirements"
//                 variant="outlined"
//               />
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             bgcolor: "background.paper",
//             border: "2px solid #000",
//             boxShadow: 24,
//             p: 4,
//             minWidth: 300
//           }}
//         >
//           <IconButton
//             sx={{ position: "absolute", top: 8, right: 8 }}
//             onClick={handleCloseModal}
//           >
//             <CloseIcon />
//           </IconButton>
//           {selectedProposal && (
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <Typography variant="h5" gutterBottom>
//                 {
//                   proposals.find((proposal) => proposal.id === selectedProposal)
//                     ?.badges_version.title
//                 }
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 Requirements:
//               </Typography>
//               <ul>
//                 {proposals
//                   .find((proposal) => proposal.id === selectedProposal)
//                   ?.badges_version.requirements.map((req) => (
//                     <li key={req.id}>
//                       <Typography variant="body2">{req.description}</Typography>
//                     </li>
//                   ))}
//               </ul>
//               <Grid container spacing={2} sx={{ mt: 2 }}>
//                 <Grid item xs={6} md={3}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     onClick={() => handleAcceptProposal(selectedProposal)}
//                   >
//                     Accept
//                   </Button>
//                 </Grid>
//                 <Grid item xs={6} md={3}>
//                   <Button
//                     fullWidth
//                     variant="outlined"
//                     onClick={() => handleDeclineProposal(selectedProposal)}
//                   >
//                     Decline
//                   </Button>
//                 </Grid>
//                 {showMotivation && selectedProposal && (
//                   <Grid
//                     container
//                     spacing={2}
//                     sx={{ mt: 2, alignItems: "center" }}
//                   >
//                     <Grid item xs={8}>
//                       <Controller
//                         name="motivation"
//                         control={control}
//                         rules={{
//                           required: "Motivation is required",
//                           maxLength: {
//                             value: 255,
//                             message:
//                               "Motivation description must be at most 255 characters long"
//                           }
//                         }}
//                         render={({ field }) => (
//                           <TextField
//                             fullWidth
//                             label="Motivation for Decline"
//                             value={motivation}
//                             onChange={(e) =>
//                               handleMotivationChange(e.target.value)
//                             }
//                             size="small"
//                             error={!!errors.motivation}
//                             helperText={errors.motivation?.message}
//                             {...field}
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item xs={4}>
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         sx={{
//                           height: "100%",
//                           minWidth: "80px",
//                           mt: 1,
//                           display: "flex",
//                           justifyContent: "center"
//                         }}
//                         size="small"
//                       >
//                         Confirm Decline
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 )}
//               </Grid>
//             </form>
//           )}
//         </Box>
//       </Modal>
//       <CustomSnackbar
//         open={acceptSnackbarOpen}
//         onClose={handleSnackbarClose}
//         severity="success"
//         message="You have accepted the proposal!"
//       />

//       <CustomSnackbar
//         open={declineSnackbarOpen}
//         onClose={handleSnackbarClose}
//         severity="success"
//         message="You have declined the proposal!"
//       />
//     </BasicPage>
//   );
// };

// export default Proposals;

/////////////////////////me containers
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  GET_PROPOSALS_CANDIDATURE,
  PROPOSAL_RESPONSE
} from "../../state/GraphQL/Mutations/Mutations";
import {
  TextField,
  Button,
  Modal,
  Typography,
  Box,
========
import React from "react";
import {
>>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18:react-badges/src/views/engineer/ProposalsView.jsx
  Grid,
  Typography,
  Modal,
  Box,
  Button,
  TextField,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
<<<<<<<< HEAD:react-badges/src/views/engineer/Proposals.jsx
import { IconButton } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { useForm, Controller } from "react-hook-form";
========
>>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18:react-badges/src/views/engineer/ProposalsView.jsx
import BadgeCard from "../../components/ComponentsEngineer/BadgeCard";
>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18
import InfoAlert from "../../components/ComponentsEngineer/Alert";
import CustomSnackbar from "../../components/ComponentsEngineer/SnackBarAlert";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { Controller } from "react-hook-form";

<<<<<<< HEAD
=======
<<<<<<<< HEAD:react-badges/src/views/engineer/Proposals.jsx
const Proposals = () => {
  const { user_id } = useContext(AuthContext);
  const [proposalResponse] = useMutation(PROPOSAL_RESPONSE);
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
      await proposalResponse({
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
      await proposalResponse({
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

  if (loading)
    return (
      <CenteredLayout>
        <LoadableCurtain text="Cadidatures" />
      </CenteredLayout>
    );
  if (error) return `Error: ${error.message}`;

========
>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18
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
<<<<<<< HEAD



  return (
    <BasicPage
      fullpage
      title="Candidature Proposals From Managers"
    >
      <Typography
       variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
=======
>>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18:react-badges/src/views/engineer/ProposalsView.jsx
  return (
    <BasicPage fullpage title="Candidature Proposals From Managers">
      <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18
        You have received candidature proposals from your managers. Please take
        the time to review each proposal carefully and proceed with the
        appropriate action.
      </Typography>
      {proposals.length === 0 ? (
        <InfoAlert message={` No available proposals!`} />
      ) : (
<<<<<<< HEAD
=======
<<<<<<<< HEAD:react-badges/src/views/engineer/Proposals.jsx
    
========
>>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18:react-badges/src/views/engineer/ProposalsView.jsx
>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18
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
<<<<<<< HEAD
      
=======
<<<<<<<< HEAD:react-badges/src/views/engineer/Proposals.jsx
      
========

>>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18:react-badges/src/views/engineer/ProposalsView.jsx
>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18
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

<<<<<<< HEAD
export default ProposalsView;
=======
<<<<<<<< HEAD:react-badges/src/views/engineer/Proposals.jsx
export default Proposals;

========
export default ProposalsView;
>>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18:react-badges/src/views/engineer/ProposalsView.jsx
>>>>>>> e3e2c0765e211e88c2fca80a1916535d0e4f4c18
