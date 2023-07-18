//acordions way
// import React, { useContext, useEffect, useState } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import {
//   TextField,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Grid,
//   Container,
//   Box
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { AuthContext } from "../../state/with-auth";

// // const GET_PROPOSALS_CANDIDATURE = gql`
// //   query MyQuery($engineerId: Int!) {
// //     manager_to_engineer_badge_candidature_proposals(
// //       where: { engineer: { _eq: $engineerId } }
// //     ) {
// //       badge_id
// //       created_by
// //       badges_version {
// //         title
// //         requirements
// //         description
// //       }
// //       id
// //       user {
// //         id
// //         name
// //       }
// //     }
// //   }
// // `;

// //per filter
// const GET_PROPOSALS_CANDIDATURE = gql`
//   query MyQuery($engineerId: Int!) {
//     manager_to_engineer_badge_candidature_proposals(
//       where: {engineer: {_eq: $engineerId},
//       engineer_badge_candidature_proposal_responses: {is_approved: {_eq: false}}
//     }){
//         badge_id
//         created_by
//         badges_version {
//           title
//           requirements
//           description
//         }
//        id
//         user {
//           id
//           name
//         }
//     }
//   }
// `;

// const ACCEPT_PROPOSAL= gql`
// mutation MyMutation(
//   $proposal_id: Int!,
//   $created_by: Int!,
//   $disapproval_motivation: String!
//   $is_approved: Boolean!
// ) {
//   insert_engineer_badge_candidature_proposal_response(
//     objects: {
//       proposal_id: $proposal_id,
//        created_by: $created_by,
//         disapproval_motivation: $disapproval_motivation,
//         is_approved:  $is_approved}) {
//     affected_rows
//   }
// }`

// const Proposals = () => {
//   const { user_id } = useContext(AuthContext);

//   const r7 = useQuery(GET_PROPOSALS_CANDIDATURE, {
//     variables: {
//       engineerId: user_id
//     }
//   });

//   console.log("nameeii:", r7);

//   const [acceptProposal] = useMutation(ACCEPT_PROPOSAL);
//   const [motivation, setMotivation] = useState("");
//   const [showMotivation, setShowMotivation] = useState(false);
//   const [selectedProposalId, setSelectedProposalId] = useState(null);

//   const handleAcceptProposal = (proposalId) => {
//     acceptProposal({
//       variables: {
//         proposal_id: proposalId,
//         created_by: user_id,
//         is_approved: true,
//         disapproval_motivation: null
//       }
//     })
//       .then((result) => {
//         console.log("Accept proposal result:", result);
//       })
//       .catch((error) => {
//         console.error("Accept proposal error:", error);
//       });
//   };

//   const handleDeclineProposal = (proposalId) => {
//     setSelectedProposalId(proposalId);
//     setShowMotivation(true);
//   };

//   const handleMotivationChange = (event) => {
//     setMotivation(event.target.value);
//   };

//   const handleConfirmDecline = () => {
//     acceptProposal({
//       variables: {
//         proposal_id: selectedProposalId,
//         created_by: user_id,
//         is_approved: false,
//         disapproval_motivation: motivation
//       }
//     })
//       .then((result) => {
//         console.log("Decline proposal result:", result);
//         setShowMotivation(false);
//         setSelectedProposalId(null);
//         setMotivation("");
//       })
//       .catch((error) => {
//         console.error("Decline proposal error:", error);
//       });
//   };

//   if (r7.loading) return "loading...";
//   if (r7.error) throw r7.error;

//   const proposals = r7.data.manager_to_engineer_badge_candidature_proposals;

//   return (
//     <BasicPage fullpage title=" Candidature Proposals" subtitle="Engineer">
//       <Container>
//         {proposals.length === 0 ? (
//           <Typography variant="body1">No proposals available</Typography>
//         ) : (
//           proposals.map((badge, index) => (
//             <Accordion key={badge.id} sx={{ mt: 1 }}>
//               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Grid
//                   container
//                   direction="column"
//                   sx={{ flexDirection: "column", alignItems: "flex-start" }}
//                 >
//                   <Grid item>
//                     <Typography variant="h5">
//                       {badge.badges_version.title}
//                     </Typography>
//                   </Grid>
//                   <Grid item>
//                     <Typography
//                       variant="body2"
//                       sx={{ fontSize: "12px", color: "grey" }}
//                     >
//                       From: {badge.user.name}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </AccordionSummary>

//               <AccordionDetails>
//                 <Box display="flex" flexDirection="column">
//                   <Typography variant="body1">
//                     {badge.badges_version.description}
//                   </Typography>
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="h6" fontWeight="bold">
//                       Requirements
//                     </Typography>
//                     <ol>
//                       {badge.badges_version.requirements.map((req, index) => (
//                         <li key={req.title}>
//                           <Typography variant="body2">
//                             {`${req.title}`}
//                           </Typography>
//                         </li>
//                       ))}
//                     </ol>
//                   </Box>
//                   <Grid container spacing={2} sx={{ mt: 2 }}>
//                     <Grid item xs={6} md={3}>
//                       <Button
//                         fullWidth
//                         variant="contained"
//                         onClick={() => handleAcceptProposal(badge.id)}
//                       >
//                         Accept
//                       </Button>
//                     </Grid>
//                     <Grid item xs={6} md={3}>
//                       <Button
//                         fullWidth
//                         variant="outlined"
//                         onClick={() => handleDeclineProposal(badge.id)}
//                       >
//                         Decline
//                       </Button>
//                     </Grid>
//                     {showMotivation && selectedProposalId === badge.id && (

//                       <Grid
//                         container
//                         spacing={2}
//                         sx={{ mt: 2, alignItems: "center" }}
//                       >
//                         <Grid item xs={8}>
//                           <TextField
//                             fullWidth
//                             label="Motivation for Decline"
//                             value={motivation}
//                             onChange={handleMotivationChange}
//                             size="small"
//                           />
//                         </Grid>
//                         <Grid item xs={4}>
//                           <Button
//                             variant="contained"
//                             onClick={handleConfirmDecline}
//                             sx={{ height: "100%", minWidth: "80px", mt: 1, display: "flex", justifyContent: "center" }}
//                             size="small"
//                           >
//                             Confirm Decline
//                           </Button>
//                         </Grid>
//                       </Grid>
//                     )}
//                   </Grid>
//                 </Box>
//               </AccordionDetails>
//             </Accordion>
//           ))
//         )}
//       </Container>
//     </BasicPage>
//   );
// };

// export default Proposals;








//final wayyyyyyyyyyyyyyyyyyyyyyyyyyyy g
// import React, { useContext, useEffect, useState } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import {
//   TextField,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Grid,
//   Container,
//   Box
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { AuthContext } from "../../state/with-auth";

// const GET_PROPOSALS_CANDIDATURE = gql`
//   query MyQuery($engineerId: Int!, $isApproved: Boolean!) {
//     manager_to_engineer_badge_candidature_proposals(
//       where: {
//         engineer: { _eq: $engineerId }
//         engineer_badge_candidature_proposal_responses: {
//           is_approved: { _eq: $isApproved }
//         }
//       }
//     ) {
//       badge_id
//       created_by
//       badges_version {
//         title
//         requirements
//         description
//       }
//       id
//       user {
//         id
//         name
//       }
//     }
//   }
// `;

// const ACCEPT_PROPOSAL = gql`
//   mutation MyMutation(
//     $proposal_id: Int!
//     $created_by: Int!
//     $disapproval_motivation: String!
//     $is_approved: Boolean!
//   ) {
//     insert_engineer_badge_candidature_proposal_response(
//       objects: {
//         proposal_id: $proposal_id
//         created_by: $created_by
//         disapproval_motivation: $disapproval_motivation
//         is_approved: $is_approved
//       }
//     ) {
//       affected_rows
//     }
//   }
// `;

// const Proposals = () => {
//   const { user_id } = useContext(AuthContext);

//   const r7 = useQuery(GET_PROPOSALS_CANDIDATURE, {
//     variables: {
//       engineerId: user_id,
//       isApproved: false
//     }
//   });

//   const [acceptProposal] = useMutation(ACCEPT_PROPOSAL);
//   const [motivation, setMotivation] = useState("");
//   const [showMotivation, setShowMotivation] = useState(false);
//   const [selectedProposalId, setSelectedProposalId] = useState(null);
//   const [proposals, setProposals] = useState([]);

//   useEffect(() => {
//     if (r7.data) {
//       setProposals(r7.data.manager_to_engineer_badge_candidature_proposals);
//     }
//   }, [r7.data]);

//   const handleAcceptProposal = (proposalId) => {
//     acceptProposal({
//       variables: {
//         proposal_id: proposalId,
//         created_by: user_id,
//         is_approved: true,
//         disapproval_motivation: null
//       }
//     })
//       .then((result) => {
//         console.log("Accept proposal result:", result);
//         removeAcceptedBadge(proposalId);
//       })
//       .catch((error) => {
//         console.error("Accept proposal error:", error);
//       });
//   };

//   const handleDeclineProposal = (proposalId) => {
//     setSelectedProposalId(proposalId);
//     setShowMotivation(true);
//   };

//   const handleMotivationChange = (event) => {
//     setMotivation(event.target.value);
//   };

//   const handleConfirmDecline = () => {
//     acceptProposal({
//       variables: {
//         proposal_id: selectedProposalId,
//         created_by: user_id,
//         is_approved: false,
//         disapproval_motivation: motivation
//       }
//     })
//       .then((result) => {
//         console.log("Decline proposal result:", result);
//         setShowMotivation(false);
//         setSelectedProposalId(null);
//         setMotivation("");
//         removeAcceptedBadge(selectedProposalId);
//       })
//       .catch((error) => {
//         console.error("Decline proposal error:", error);
//       });
//   };

//   const removeAcceptedBadge = (proposalId) => {
//     setProposals((prevProposals) => {
//       return prevProposals.filter((proposal) => proposal.id !== proposalId);
//     });
//   };

//   if (r7.loading) return "loading...";
//   if (r7.error) throw r7.error;

//   return (
//     <BasicPage fullpage title="Candidature Proposals" subtitle="Engineer">
//       <Container>
//         {proposals.length === 0 ? (
//           <Typography variant="body1">No proposals available</Typography>
//         ) : (
//           proposals.map((badge, index) => {
//             const isProposalSelected = selectedProposalId === badge.id;
//             const isMotivationVisible = showMotivation && isProposalSelected;

//             return (
//               <Accordion key={badge.id} sx={{ mt: 1 }}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Grid
//                     container
//                     direction="column"
//                     sx={{ flexDirection: "column", alignItems: "flex-start" }}
//                   >
//                     <Grid item>
//                       <Typography variant="h5">
//                         {badge.badges_version.title}
//                       </Typography>
//                     </Grid>
//                     <Grid item>
//                       <Typography
//                         variant="body2"
//                         sx={{ fontSize: "12px", color: "grey" }}
//                       >
//                         From: {badge.user.name}
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </AccordionSummary>

//                 <AccordionDetails>
//                   <Box display="flex" flexDirection="column">
//                     <Typography variant="body1">
//                       {badge.badges_version.description}
//                     </Typography>
//                     <Box sx={{ mt: 2 }}>
//                       <Typography variant="h6" fontWeight="bold">
//                         Requirements
//                       </Typography>
//                       <ol>
//                         {badge.badges_version.requirements.map((req, index) => (
//                           <li key={req.title}>
//                             <Typography variant="body2">
//                               {`${req.title}`}
//                             </Typography>
//                           </li>
//                         ))}
//                       </ol>
//                     </Box>
//                     <Grid container spacing={2} sx={{ mt: 2 }}>
//                       <Grid item xs={6} md={3}>
//                         <Button
//                           fullWidth
//                           variant="contained"
//                           onClick={() => handleAcceptProposal(badge.id)}
//                           disabled={isProposalSelected}
//                         >
//                           Accept
//                         </Button>
//                       </Grid>
//                       <Grid item xs={6} md={3}>
//                         <Button
//                           fullWidth
//                           variant="outlined"
//                           onClick={() => handleDeclineProposal(badge.id)}
//                           disabled={isProposalSelected}
//                         >
//                           Decline
//                         </Button>
//                       </Grid>
//                       {isMotivationVisible && (
//                         <Grid
//                           container
//                           spacing={2}
//                           sx={{ mt: 2, alignItems: "center" }}
//                         >
//                           <Grid item xs={8}>
//                             <TextField
//                               fullWidth
//                               label="Motivation for Decline"
//                               value={motivation}
//                               onChange={handleMotivationChange}
//                               size="small"
//                             />
//                           </Grid>
//                           <Grid item xs={4}>
//                             <Button
//                               variant="contained"
//                               onClick={handleConfirmDecline}
//                               sx={{
//                                 height: "100%",
//                                 minWidth: "80px",
//                                 mt: 1,
//                                 display: "flex",
//                                 justifyContent: "center"
//                               }}
//                               size="small"
//                             >
//                               Confirm Decline
//                             </Button>
//                           </Grid>
//                         </Grid>
//                       )}
//                     </Grid>
//                   </Box>
//                 </AccordionDetails>
//               </Accordion>
//             );
//           })
//         )}
//       </Container>
//     </BasicPage>
//   );
// };

// export default Proposals;




/////hook form
import React, { useContext, useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Container,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { useForm } from "react-hook-form";

const GET_PROPOSALS_CANDIDATURE = gql`
  query MyQuery($engineerId: Int!, $isApproved: Boolean!) {
    manager_to_engineer_badge_candidature_proposals(
      where: {
        engineer: { _eq: $engineerId }
        engineer_badge_candidature_proposal_responses: {
          is_approved: { _eq: $isApproved }
        }
      }
    ) {
      badge_id
      created_by
      badges_version {
        title
        requirements
        description
      }
      id
      user {
        id
        name
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

  const r7 = useQuery(GET_PROPOSALS_CANDIDATURE, {
    variables: {
      engineerId: user_id,
      isApproved: false
    }
  });

  const [acceptProposal] = useMutation(ACCEPT_PROPOSAL);
  const [showMotivation, setShowMotivation] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [proposals, setProposals] = useState([]);
  
  const { handleSubmit, register, formState: { errors } } = useForm();

  useEffect(() => {
    if (r7.data) {
      setProposals(r7.data.manager_to_engineer_badge_candidature_proposals);
    }
  }, [r7.data]);

  const handleAcceptProposal = (proposalId) => {
    acceptProposal({
      variables: {
        proposal_id: proposalId,
        created_by: user_id,
        is_approved: true,
        disapproval_motivation: null
      }
    })
      .then((result) => {
        console.log("Accept proposal result:", result);
        removeAcceptedBadge(proposalId);
      })
      .catch((error) => {
        console.error("Accept proposal error:", error);
      });
  };

  const handleDeclineProposal = (proposalId) => {
    setSelectedProposalId(proposalId);
    setShowMotivation(true);
  };

  const handleMotivationChange = () => {
    // handle motivation change if needed
  };

  const handleConfirmDecline = handleSubmit((data) => {
    acceptProposal({
      variables: {
        proposal_id: selectedProposalId,
        created_by: user_id,
        is_approved: false,
        disapproval_motivation: data.motivation
      }
    })
      .then((result) => {
        console.log("Decline proposal result:", result);
        setShowMotivation(false);
        setSelectedProposalId(null);
        removeAcceptedBadge(selectedProposalId);
      })
      .catch((error) => {
        console.error("Decline proposal error:", error);
      });
  });

  const removeAcceptedBadge = (proposalId) => {
    setProposals((prevProposals) => {
      return prevProposals.filter((proposal) => proposal.id !== proposalId);
    });
  };

  if (r7.loading) return "loading...";
  if (r7.error) throw r7.error;

  return (
    <BasicPage fullpage title="Candidature Proposals" subtitle="Engineer">
      <Container>
        {proposals.length === 0 ? (
          <Typography variant="body1">No proposals available</Typography>
        ) : (
          proposals.map((badge, index) => {
            const isProposalSelected = selectedProposalId === badge.id;
            const isMotivationVisible = showMotivation && isProposalSelected;

            return (
              <Accordion key={badge.id} sx={{ mt: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Grid
                    container
                    direction="column"
                    sx={{ flexDirection: "column", alignItems: "flex-start" }}
                  >
                    <Grid item>
                      <Typography variant="h5">
                        {badge.badges_version.title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "12px", color: "grey" }}
                      >
                        From: {badge.user.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1">
                      {badge.badges_version.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        Requirements
                      </Typography>
                      <ol>
                        {badge.badges_version.requirements.map((req, index) => (
                          <li key={req.title}>
                            <Typography variant="body2">
                              {`${req.title}`}
                            </Typography>
                          </li>
                        ))}
                      </ol>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={6} md={3}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleAcceptProposal(badge.id)}
                          disabled={isProposalSelected}
                        >
                          Accept
                        </Button>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleDeclineProposal(badge.id)}
                          disabled={isProposalSelected}
                        >
                          Decline
                        </Button>
                      </Grid>
                      {isMotivationVisible && (
                        <Grid
                          container
                          spacing={2}
                          sx={{ mt: 2, alignItems: "center" }}
                        >
                          <Grid item xs={8}>
                            <TextField
                              fullWidth
                              label="Motivation for Decline"
                              {...register("motivation", {
                                required: "Motivation is required.",
                                maxLength: {
                                  value: 100,
                                  message: "Motivation must be less than 100 characters."
                                }
                              })}
                              error={errors.motivation ? true : false}
                              helperText={errors.motivation?.message}
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
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Container>
    </BasicPage>
  );
};

export default Proposals;







/////////////////////cards way
// import React, { useContext, useEffect, useState } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import {
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Modal,
//   Typography,
//   Box,
//   Grid,
//   Container
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import CloseIcon from "@mui/icons-material/Close";
// import { IconButton } from "@mui/material";
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { AuthContext } from "../../state/with-auth";

// const GET_PROPOSALS_CANDIDATURE = gql`
//   query MyQuery($engineerId: Int!) {
//     manager_to_engineer_badge_candidature_proposals(
//       where: { engineer: { _eq: $engineerId } }
//     ) {
//       badge_id
//       created_by
//       badges_version {
//         title
//         requirements
//         description
//       }
//       id
//       user {
//         id
//         name
//       }
//     }
//   }
// `;

// const ACCEPT_PROPOSAL = gql`
//   mutation MyMutation(
//     $proposal_id: Int!
//     $is_approved: Boolean!
//     $disapproval_motivation: String!
//   ) {
//     update_engineer_badge_candidature_proposal_response(
//       where: { proposal_id: { _eq: $proposal_id } }
//       _set: {
//         is_approved: $is_approved
//         disapproval_motivation: $disapproval_motivation
//       }
//     ) {
//       returning {
//         is_approved
//         disapproval_motivation
//         proposal_id
//         response_id
//       }
//     }
//   }
// `;

// const Proposals = () => {
//   const { user_id } = useContext(AuthContext);

//   const r7 = useQuery(GET_PROPOSALS_CANDIDATURE, {
//     variables: {
//       engineerId: user_id
//     }
//   });

//   console.log("nameeii:", r7);

//   const [acceptProposal] = useMutation(ACCEPT_PROPOSAL);
//   const [motivation, setMotivation] = useState("");
//   const [showMotivation, setShowMotivation] = useState(false);
//   const [selectedProposal, setSelectedProposal] = useState(null);

//   const handleAcceptProposal = (proposalId) => {
//     acceptProposal({
//       variables: {
//         proposal_id: proposalId,
//         is_approved: true,
//         disapproval_motivation: null
//       }
//     })
//       .then((result) => {
//         console.log("Accept proposal result:", result);
//         handleCloseModal(); // Close the modal
//       })
//       .catch((error) => {
//         console.error("Accept proposal error:", error);
//       });
//   };

//   const handleDeclineProposal = (proposalId) => {
//     setSelectedProposal(proposalId);
//     setShowMotivation(true);
//   };

//   const handleMotivationChange = (event) => {
//     setMotivation(event.target.value);
//   };

//   const handleConfirmDecline = () => {
//     acceptProposal({
//       variables: {
//         proposal_id: selectedProposal,
//         is_approved: false,
//         disapproval_motivation: motivation
//       }
//     })
//       .then((result) => {
//         console.log("Decline proposal result:", result);
//         setShowMotivation(false);
//         setSelectedProposal(null);
//         setMotivation("");
//         handleCloseModal(); // Close the modal
//       })
//       .catch((error) => {
//         console.error("Decline proposal error:", error);
//       });
//   };

//   const [openModal, setOpenModal] = useState(false);

//   const handleOpenModal = (proposalId) => {
//     setSelectedProposal(proposalId);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   if (r7.loading) return "loading...";
//   if (r7.error) throw r7.error;

//   const proposals = r7.data.manager_to_engineer_badge_candidature_proposals;

//   return (
//     <BasicPage fullpage title="Candidature Proposals" subtitle="Engineer">
//       <Container>
//         {proposals.length === 0 ? (
//           <Typography variant="body1">No proposals available</Typography>
//         ) : (
//           proposals.map((badge, index) => (
//             <Card key={badge.id} sx={{ mt: 1 }}>
//               <CardContent>
//                 <Typography variant="h5" gutterBottom>
//                   {badge.badges_version.title}
//                 </Typography>
//                 <Typography variant="body1">
//                   {badge.badges_version.description}
//                 </Typography>
//                 <Box sx={{ mt: 2 }}>
//                   <Button
//                     variant="outlined"
//                     onClick={() => handleOpenModal(badge.id)}
//                   >
//                     View Requirements
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </Container>

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
//             <>
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
//                       <TextField
//                         fullWidth
//                         label="Motivation for Decline"
//                         value={motivation}
//                         onChange={handleMotivationChange}
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={4}>
//                       <Button
//                         variant="contained"
//                         onClick={handleConfirmDecline}
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
//             </>
//           )}
//         </Box>
//       </Modal>
//     </BasicPage>
//   );
// };

// export default Proposals;
