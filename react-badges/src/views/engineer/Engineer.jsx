//check i false, u rregullua pending
import { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Alert } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomDialog from "./ComponentsEngineer/DialogComponent";
import BadgeCard from "./ComponentsEngineer/BadgeCardComponent";
import BadgeApplicationDialog from "./ComponentsEngineer/BadgeApplicationComponent";

const GET_BADGES_VERSIONS = gql`
  query lastVersionBadges {
    badges_versions_last {
      id
      title
      description
      requirements
      created_at
    }
  }
`;

const ADD_REQUEST = gql`
  mutation insertBadgeCandidature(
    $badge_id: Int!
    $manager: Int!
    $proposal_description: String!
    $badge_version: timestamp
    $created_by: Int!
  ) {
    insert_engineer_to_manager_badge_candidature_proposals_one(
      object: {
        badge_id: $badge_id
        manager: $manager
        proposal_description: $proposal_description
        badge_version: $badge_version
        created_by: $created_by
      }
    ) {
      id
    }
  }
`;

const GET_MANAGER_BY_ENGINEER = gql`
  query managerByEngineer($engineerId: Int!) {
    users_relations(where: { engineer: { _eq: $engineerId } }) {
      userByManager {
        id
        name
      }
    }
  }
`;

const GET_PENDING_PROPOSALS = gql`
  mutation pendingFromEngineer($engineerId: Int!) {
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

const GET_PENDING_PROPOSALS_FOR_MANAGER = gql`
  mutation pendingFromManager($engineerId: Int!) {
    get_pending_proposals_for_manager(args: { engineerid: $engineerId }) {
      badge_id
      id
      badges_version {
        title
      }
    }
  }
`;

const GET_APPROVED_BADGES = gql`
  query wonBadges($engineerId: Int!) {
    badge_candidature_request(
      where: {
        issuing_requests: { is_approved: { _eq: true } }
        engineer_id: { _eq: $engineerId }
      }
    ) {
      id
      badge_id
      issuing_requests {
        request_id
      }
    }
  }
`;

const GET_APPROVED_REQUESTS = gql`
  query approvedBadgeCandidatureRequest($engineerId: Int!) {
    badge_candidature_request(
      where: { is_issued: { _eq: false }, engineer_id: { _eq: $engineerId } }
    ) {
      badge_id
      id
    }
  }
`;

const ISSUE_REQUEST_NOT_ANSWERED = gql`
  query issueRequestNotAnswered($engineerId: Int!) {
    issuing_requests(
      where: {
        badge_candidature_request: { engineer_id: { _eq: $engineerId } }
        is_approved: { _is_null: true }
      }
    ) {
      id
      badge_candidature_request {
        badge_id
      }
    }
  }
`;

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
        (proposal) => proposal.badge_id === badge.id
      );

    const isBadgePendingManager =
      dataPendingProposalsManager?.get_pending_proposals_for_manager.some(
        (proposal) => proposal.badge_id === badge.id
      );

    const hasApprovedBadge = approvedBadgeData?.badge_candidature_request.some(
      (request) => request.badge_id === badge.id
    );

    const hasApprovedRequest =
      approvedRequestData?.badge_candidature_request.some(
        (request) => request.badge_id === badge.id
      );

    const notAnswered = notAnsweredIssueRequestData?.issuing_requests.some(
      (request) => request.badge_candidature_request.badge_id === badge.id
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
      <br />
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
