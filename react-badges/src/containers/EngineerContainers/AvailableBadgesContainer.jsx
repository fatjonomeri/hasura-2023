import { useContext, useState, useEffect } from "react";
import {
  GET_BADGES_VERSIONS,
  GET_MANAGER_BY_ENGINEER,
  GET_APPROVED_BADGES,
  GET_APPROVED_REQUESTS,
  ISSUE_REQUEST_NOT_ANSWERED
} from "../../state/GraphQL/Queries/Queries";
import {
  ADD_REQUEST,
  GET_PENDING_PROPOSALS,
  GET_PENDING_PROPOSALS_FOR_MANAGER
} from "../../state/GraphQL/Mutations/Mutations";
import { useQuery, useMutation } from "@apollo/client";
import { AuthContext } from "../../state/with-auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CenteredLayout from "../../layouts/CenteredLayout";
import LoadableCurtain from "../../components/LoadableCurtain";
import AvailableBadgesView from "../../views/engineer/AvailableBadgesView";

const AvailableBadgesContainer = () => {
  const { user_id } = useContext(AuthContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset
  } = useForm({ mode: "onChange" });
  const [selectedManager, setSelectedManager] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
  const [showMessage, setShowMessage] = useState({
    pendingBadge: false,
    managerProposal: false,
    approvedBadge: false,
    approvedRequest: false,
    notAnsweredRequest: false
  });
  const navigate = useNavigate();

  const {
    data: badgesVersion,
    loading: badgesVersionLoading,
    error: badgesVersionLoadingError
  } = useQuery(GET_BADGES_VERSIONS);
  const managerByEngineer = useQuery(GET_MANAGER_BY_ENGINEER, {
    variables: {
      engineerId: user_id
    }
  });

  const { data: approvedBadgeData, refetch: refetchApprovedBadges } = useQuery(
    GET_APPROVED_BADGES,
    {
      variables: {
        engineerId: user_id
      }
    }
  );
  console.log("approved", approvedBadgeData);

  const { data: approvedRequestData, refetch: refetchApprovedRequest } =
    useQuery(GET_APPROVED_REQUESTS, {
      variables: {
        engineerId: user_id
      }
    });
  console.log("approved request", approvedRequestData);

  const { data: notAnsweredIssueRequestData, refetch: refetchNotAnswered } =
    useQuery(ISSUE_REQUEST_NOT_ANSWERED, {
      variables: {
        engineerId: user_id
      }
    });
  console.log("not answered", notAnsweredIssueRequestData);

  const [addRequest] = useMutation(ADD_REQUEST);

  const [
    getPendingProposals,
    {
      loading: loadingPendingProposals,
      error: errorPendingProposals,
      data: dataPendingProposals
    }
  ] = useMutation(GET_PENDING_PROPOSALS, {
    fetchPolicy: "network-only"
  });

  const [
    getPendingProposalForManager,
    {
      loading: loadingPendingProposalsManager,
      error: errorPendingProposalsManager,
      data: dataPendingProposalsManager
    }
  ] = useMutation(GET_PENDING_PROPOSALS_FOR_MANAGER, {
    fetchPolicy: "network-only"
  });

  const handleOpenModal = (badge) => {
    const isBadgePending =
      dataPendingProposals?.get_pending_proposals_for_engineer.some(
        (proposal) =>
          proposal.badge_id === badge.id &&
          proposal.badge_version === badge.created_at
      );

    const isBadgePendingManager =
      dataPendingProposalsManager?.get_pending_proposals_for_manager.some(
        (proposal) =>
          proposal.badge_id === badge.id &&
          proposal.badge_version === badge.created_at
      );

    const hasApprovedBadge = approvedBadgeData?.badge_candidature_request.some(
      (request) =>
        request.badge_id === badge.id &&
        request.badge_version === badge.created_at
    );

    console.log("sddddddddddddddd", hasApprovedBadge);

    const hasApprovedRequest =
      approvedRequestData?.badge_candidature_request.some(
        (request) =>
          request.badge_id === badge.id &&
          request.badge_version === badge.created_at
      );

    const notAnswered = notAnsweredIssueRequestData?.issuing_requests.some(
      (request) =>
        request.badge_candidature_request.badge_id === badge.id &&
        request.badge_candidature_request.badge_version === badge.created_at
    );

    setSelectedBadge(badge);

    if (isBadgePending) {
      setShowMessage({ pendingBadge: true });
    } else if (isBadgePendingManager) {
      setShowMessage({ managerProposal: true });
    } else if (hasApprovedBadge) {
      setShowMessage({ approvedBadge: true });
    } else if (hasApprovedRequest) {
      setShowMessage({ approvedRequest: true });
    } else if (notAnswered) {
      setShowMessage({ notAnsweredRequest: true });
    } else {
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedManager(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (selectedBadge) {
      const { id, created_at } = selectedBadge;
      try {
        await addRequest({
          variables: {
            badge_id: id,
            manager: selectedManager.value,
            proposal_description: data.motivationDescription,
            badge_version: created_at,
            created_by: user_id
          }
        });
        setOpenModal(false);
        setSelectedManager(null);
        setIsApplicationSubmitted(true);
        reset();
        console.log("pending", dataPendingProposals);
      } catch (error) {
        console.error("Error submitting application:", error);
      }
    }
  };

  useEffect(() => {
    getPendingProposals({
      variables: {
        engineerId: user_id
      }
    });
    getPendingProposalForManager({
      variables: {
        engineerId: user_id
      }
    });
    refetchApprovedBadges();
    refetchApprovedRequest();
    refetchNotAnswered();
    console.log("hhhhhh");
  }, [isApplicationSubmitted]);

  if (badgesVersionLoading)
    return (
      <CenteredLayout>
        <LoadableCurtain text="Available Badges" />
      </CenteredLayout>
    );

  if (badgesVersionLoadingError || managerByEngineer.error)
    throw badgesVersionLoadingError || managerByEngineer.error;

  const options =
    managerByEngineer.data?.users_relations?.map((user) => ({
      label: user.userByManager.name,
      value: user.userByManager.id
    })) || [];

  const isManagerListEmpty = !managerByEngineer.data?.users_relations?.length;

  return (
    <AvailableBadgesView
      isManagerListEmpty={isManagerListEmpty}
      badgesVersion={badgesVersion}
      dataPendingProposals={dataPendingProposals}
      dataPendingProposalsManager={dataPendingProposalsManager}
      approvedBadgeData={approvedBadgeData}
      approvedRequestData={approvedRequestData}
      notAnsweredIssueRequestData={notAnsweredIssueRequestData}
      options={options}
      selectedManager={selectedManager}
      setSelectedManager={setSelectedManager}
      handleSubmit={handleSubmit}
      register={register}
      errors={errors}
      control={control}
      reset={reset}
      openModal={openModal}
      handleOpenModal={handleOpenModal}
      handleCloseModal={handleCloseModal}
      selectedBadge={selectedBadge}
      isApplicationSubmitted={isApplicationSubmitted}
      setIsApplicationSubmitted={setIsApplicationSubmitted}
      showMessage={showMessage}
      setShowMessage={setShowMessage}
      onSubmit={onSubmit}
      navigate={navigate}
    />
  );
};

export default AvailableBadgesContainer;
