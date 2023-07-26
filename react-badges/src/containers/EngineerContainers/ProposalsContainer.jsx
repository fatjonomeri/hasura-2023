import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_PROPOSALS_CANDIDATURE, PROPOSAL_RESPONSE } from "../../state/GraphQL/Mutations/Mutations";
import { AuthContext } from "../../state/with-auth";
import { useForm, Controller } from "react-hook-form";
import ProposalsView from "../../views/engineer/ProposalsView";
import CenteredLayout from "../../layouts/CenteredLayout";
import LoadableCurtain from "../../components/LoadableCurtain";

const ProposalsContainer = () => {
//   const { user_id } = useContext(AuthContext);
//   const [proposalResponse] = useMutation(PROPOSAL_RESPONSE);
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedProposal, setSelectedProposal] = useState(null);
//   const [motivation, setMotivation] = useState("");
//   const [showMotivation, setShowMotivation] = useState(false);
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

//   const [getAvailableProposals] = useMutation(GET_PROPOSALS_CANDIDATURE, {
//     variables: { engineerId: user_id },
//     onCompleted: (data) => {
//       setProposals(data.get_pending_proposals_for_manager);
//       setLoading(false);
//     },
//     onError: (error) => {
//       setError(error);
//       setLoading(false);
//     },
//   });

//   useEffect(() => {
//     setLoading(true);
//     getAvailableProposals();
//   }, [getAvailableProposals]);

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
//     setShowMotivation(false);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     reset();
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setAcceptSnackbarOpen(false);
//     setDeclineSnackbarOpen(false);
//   };
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
    <LoadableCurtain  text="Cadidatures" />
  </CenteredLayout>
);
if (error) return `Error: ${error.message}`;

  return (
    <ProposalsView
    loading={loading}
      error={error}
      proposals={proposals}
      handleAcceptProposal={handleAcceptProposal}
      handleDeclineProposal={handleDeclineProposal}
      handleOpenModal={handleOpenModal}
      handleCloseModal={handleCloseModal}
      handleSnackbarClose={handleSnackbarClose}
      onSubmit={onSubmit}
      selectedProposal={selectedProposal}
      showMotivation={showMotivation}
      motivation={motivation}
      handleMotivationChange={handleMotivationChange}
      control={control}
      errors={errors}
      reset={reset}
      openModal={openModal}
      handleSubmit={handleSubmit}
      acceptSnackbarOpen={acceptSnackbarOpen}
      declineSnackbarOpen={declineSnackbarOpen}
    />
  );
};

export default ProposalsContainer;
