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
import { gql, useQuery, useMutation } from "@apollo/client";
import { Alert, Typography } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/ComponentsEngineer/DialogComponent";
import BadgeCard from "../../components/ComponentsEngineer/BadgeCardComponent";
import BadgeApplicationDialog from "../../components/ComponentsEngineer/BadgeApplicationComponent";

const Engineer = () => {
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

  const badgesVersion = useQuery(GET_BADGES_VERSIONS);
  const managerByEngineer = useQuery(GET_MANAGER_BY_ENGINEER, {
    variables: {
      engineerId: user_id
    }
  });
  console.log("manager", managerByEngineer);

  const [addRequest] = useMutation(ADD_REQUEST);

  const [
    getPendingProposals,
    {
      loading: loadingPendingProposals,
      error: errorPendingProposals,
      data: dataPendingProposals
    }
  ] = useMutation(GET_PENDING_PROPOSALS, { fetchPolicy: "network-only" });

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

  const handleOpenModal = (badge) => {
    const isBadgePending =
      dataPendingProposals?.get_pending_proposals_for_engineer.some(
        (proposal) =>
          proposal.badge_id === badge.id &&
          proposal.badge_version === badge.created_at
      );

    console.log("dataPendingProposals", dataPendingProposals);

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

    const hasApprovedRequest =
      approvedRequestData?.badge_candidature_request.some(
        (request) =>
          request.badge_id === badge.id &&
          request.badge_version === badge.created_at
      );

    console.log("sddddddddddddddd", approvedRequestData);

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

  if (
    badgesVersion.loading ||
    managerByEngineer.loading ||
    loadingPendingProposals ||
    loadingPendingProposalsManager ||
    approvedBadgeData.loading ||
    approvedRequestData.loading ||
    notAnsweredIssueRequestData.loading
  )
    return "loading...";

  if (
    badgesVersion.error ||
    managerByEngineer.error ||
    errorPendingProposals ||
    errorPendingProposalsManager ||
    approvedBadgeData.error ||
    approvedRequestData.error ||
    notAnsweredIssueRequestData.error
  )
    throw (
      badgesVersion.error ||
      managerByEngineer.error ||
      errorPendingProposals ||
      errorPendingProposalsManager ||
      approvedBadgeData.error ||
      approvedRequestData.error ||
      notAnsweredIssueRequestData.error
    );

  const options =
    managerByEngineer.data?.users_relations?.map((user) => ({
      label: user.userByManager.name,
      value: user.userByManager.id
    })) || [];

  const isManagerListEmpty = !managerByEngineer.data?.users_relations?.length;

  return (
    <BasicPage fullpage title="Available Badges" subtitle="Engineer">
      <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
        Please find below the most recent versions of badges available for
        application. You may review the details of each badge and apply for the
        ones that align with your interests and qualifications. We encourage you
        to carefully consider each application, and the managers will promptly
        review your submissions.{" "}
      </Typography>
      {isManagerListEmpty && (
        <Alert severity="info" sx={{ marginBottom: "12px" }}>
          You can't apply for a badge because you don't have a manager!
        </Alert>
      )}
      <div>
        {badgesVersion.data.badges_versions_last.map((badge, index) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            handleOpenModal={handleOpenModal}
            isManagerListEmpty={isManagerListEmpty}
          />
        ))}
      </div>
      <BadgeApplicationDialog
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit(onSubmit)}
        options={options}
        errors={errors}
        control={control}
        register={register}
        isManagerListEmpty={isManagerListEmpty}
        selectedManager={selectedManager}
        setSelectedManager={setSelectedManager}
      />
      {/* Application confirmation dialog */}
      <CustomDialog
        open={isApplicationSubmitted}
        onClose={() => setIsApplicationSubmitted(false)}
        title="Application Submitted"
        contentText="You have successfully applied for the badge. Thank you for your submission!"
        closeButton="Close"
      />
      {/* Pending badge message dialog */}
      <CustomDialog
        open={showMessage.pendingBadge}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, pendingBadge: false }))
        }
        title="Badge is Pending"
        contentText="You have already applied for this badge, and it is pending approval. You can't apply again until the pending request is processed."
        closeButton="Close"
      />
      {/*Manager already proposed for this badge dialog */}
      <CustomDialog
        open={showMessage.managerProposal}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, managerProposal: false }))
        }
        title="Manager's Proposal Pending"
        contentText="Your manager has already proposed this badge for you. You can't apply again until your manager's proposal is processed."
        closeButton="Close"
        viewProposalButton="View Proposal"
        viewProposalClick={() => navigate("/engineer/proposals")}
      />
      {/*Won badge dialog */}
      <CustomDialog
        open={showMessage.approvedBadge}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, approvedBadge: false }))
        }
        title="You Cannot Apply Again"
        contentText="You have already been approved for this badge. You cannot apply again for the same badge."
        closeButton="Close"
      />
      {/*Approved request dialog */}
      <CustomDialog
        open={showMessage.approvedRequest}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, approvedRequest: false }))
        }
        title="Manager's Approval Response Pending"
        contentText="Your manager has approved you request. You should submit an issue request."
        closeButton="Close"
        viewProposalButton="Issue a request"
        viewProposalClick={() => navigate("/engineer/issuing-request")}
      />
      {/*Not answered issue request dialog */}
      <CustomDialog
        open={showMessage.notAnsweredRequest}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, notAnsweredRequest: false }))
        }
        title="Issued Request"
        contentText="You have already submitted an issue request for this badge. Please wait until your manager responds!"
        closeButton="Close"
      />

      <hr />
    </BasicPage>
  );
};

export default Engineer;
