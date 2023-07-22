//check i false, u rregullua pending
import { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  TextField,
  FormGroup,
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { useForm, Controller } from "react-hook-form";
import AutocompleteController from "./AutocompleteController";
import { useNavigate } from "react-router-dom";

const GET_BADGES_VERSIONS = gql`
  query getVersions {
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
  mutation addRequest(
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
  query getManagers($engineerId: Int!) {
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
const ENGINEER_BADGE_CANDIDATURE_PROPOSALS = gql`
  query MyQuery {
    engineer_to_manager_badge_candidature_proposals(
      where: { badge_id: { _eq: 2 } }
    ) {
      badges_version {
        title
      }
    }
  }
`;

const BADGE_CANDIDATURE_ACCEPTED = gql`
  query BCA($engineerId: Int!) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, is_issued: { _eq: false } }
    ) {
      id
      badge_id
      badge_version
    }
  }
`;

const ISSUED_REQUEST_NOT_ANSWERED = gql`
  query IRN($engineerId: Int!) {
    issuing_requests(
      where: {
        badge_candidature_request: { engineer_id: { _eq: $engineerId } }
        is_approved: { _is_null: true }
      }
    ) {
      badge_candidature_request {
        badge_id
      }
    }
  }
`;

const Engineer = () => {
  const { user_id } = useContext(AuthContext);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
  const [showPendingBadgeMessage, setShowPendingBadgeMessage] = useState(false);
  const [showManagerProposalMessage, setShowManagerProposalMessage] =
    useState(false);
  const [showBadgeRequestedMessage, setShowBadgeRequestedMessage] =
    useState(false);
    const [showBadgeIssuedMessage,setShowBadgeIssuedMessage] = useState(false)
  const navigate = useNavigate();

  const r3 = useQuery(GET_BADGES_VERSIONS);
  const rManager = useQuery(GET_MANAGER_BY_ENGINEER, {
    variables: {
      engineerId: user_id
    }
  });

  //console.log("manager", rManager);
  const [addRequest, r4] = useMutation(ADD_REQUEST);
  const [
    getPendingProposals,
    {
      loading: loadingPendingProposals,
      error: errorPendingProposals,
      data: dataPendingProposals
    }
  ] = useMutation(GET_PENDING_PROPOSALS, { fetchPolicy: "network-only" });

  const [
    getPending,
    {
      loading: loadingPendingProposalsManager,
      error: errorPendingProposalsManager,
      data: dataPendingProposalsManager
    }
  ] = useMutation(GET_PENDING_PROPOSALS_FOR_MANAGER, {
    fetchPolicy: "network-only"
  });

  const { data: dataBCA, refetch: refetchBCA } = useQuery(
    BADGE_CANDIDATURE_ACCEPTED,
    {
      variables: {
        engineerId: user_id
      }
    }
  );

  const { data: dataIRN, refetch: refetchIRN } = useQuery(
    ISSUED_REQUEST_NOT_ANSWERED,
    {
      variables: {
        engineerId: user_id
      }
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
    reset
  } = useForm({
    mode: "onChange"
  });

  const handleOpenModal = (badge) => {
    const isBadgePending =
      dataPendingProposals?.get_pending_proposals_for_engineer.some(
        (proposal) => proposal.badge_id === badge.id
      );

    const isBadgePendingManager =
      dataPendingProposalsManager?.get_pending_proposals_for_manager.some(
        (proposal) => proposal.badge_id === badge.id
      );

    const isBadgeRequested = dataBCA?.badge_candidature_view.some(
      (request) => request.badge_id === badge.id
    );

    const isBadgeIssued = dataIRN?.issuing_requests.some((ir) => ir.badge_candidature_request.badge_id === badge.id)

    console.log("isBadgeIssued", isBadgeIssued);

    if (isBadgePending) {
      // Show a message for the pending badge
      setSelectedBadge(badge);
      setShowPendingBadgeMessage(true);
    } else if (isBadgePendingManager) {
      // Show a message for the manager's pending proposal
      setSelectedBadge(badge);
      setShowManagerProposalMessage(true);
    } else if (isBadgeRequested) {
      // Show a message for the badge requested
      setSelectedBadge(badge);
      setShowBadgeRequestedMessage(true);
    }else if (isBadgeIssued) {
      // Show a message for the badge requestet
      setSelectedBadge(badge);
      setShowBadgeIssuedMessage(true);
    } else {
      setSelectedBadge(badge);
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
        setDescriptions([]);
        setSelectedManager(null);
        setIsApplicationSubmitted(true);
        reset();
        console.log("pending", dataPendingProposals);
      } catch (error) {
        console.error("Error submitting application:", error);
      }
    }
  };

  const handleApplicationConfirmationClose = () => {
    setIsApplicationSubmitted(false);
  };

  const handlePendingBadgeMessageClose = () => {
    setShowPendingBadgeMessage(false);
  };

  const handleManagerProposalMessageClose = () => {
    setShowManagerProposalMessage(false);
  };

  const handleBadgeRequestedMessageClose = () => {
    setShowBadgeRequestedMessage(false);
  };

  const handleBadgeIssuedMessageClose = () => {
    setShowBadgeIssuedMessage(false);
  };

  const isManagerListEmpty = !rManager.data?.users_relations?.length;

  useEffect(() => {
    // Fetch pending proposals for the engineer when the component mounts
    getPendingProposals({
      variables: {
        engineerId: user_id
      }
    });
    getPending({
      variables: {
        engineerId: user_id
      }
    });
    refetchBCA();
    refetchIRN();
    console.log("hhhhhh");
  }, [isApplicationSubmitted]);

  if (r3.loading || rManager.loading || loadingPendingProposals)
    return "loading...";
  if (r3.error || rManager.error || errorPendingProposals)
    throw r3.error || rManager.error || errorPendingProposals;

  const options =
    rManager.data?.users_relations?.map((user) => ({
      label: user.userByManager.name,
      value: user.userByManager.id
    })) || [];

  return (
    <BasicPage fullpage title="Available Badges" subtitle="Engineer">
      <br />
      {isManagerListEmpty && (
        <Alert severity="info" sx={{ marginBottom: "12px" }}>
          You can't apply for a badge because you don't have a manager!
        </Alert>
      )}
      <div>
        {r3.data.badges_versions_last.map((badge, index) => (
          <Card key={badge.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {badge.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="5px"
                marginBottom="5px"
              >
                {badge.description}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleOpenModal({ ...badge, index })}
                disabled={isManagerListEmpty}
              >
                Apply
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle variant="h2" fontWeight="bold">
          Confirm Application
          <Typography variant="body2" marginTop="5px">
            Write a motivation description for the badge you are applying and
            select the manager you are sending this application to.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup sx={{ marginBottom: "10px" }}>
              <AutocompleteController
                control={control}
                name="manager"
                rules={{ required: "Manager is required." }}
                options={options}
                label="Select Manager"
                isManagerListEmpty={isManagerListEmpty}
                errors={errors}
                setSelectedManager={setSelectedManager}
                selectedManager={selectedManager}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                {...register("motivationDescription", {
                  required: "Motivation Description is required.",
                  maxLength: {
                    value: 255,
                    message:
                      "Motivation Description must be at most 255 characters."
                  }
                })}
                id="outlined-basic-description"
                label="Motivation Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                error={!!errors.motivationDescription}
                helperText={errors.motivationDescription?.message}
              />
            </FormGroup>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="contained">
                Confirm Application
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Application confirmation dialog */}
      <Dialog
        open={isApplicationSubmitted}
        onClose={handleApplicationConfirmationClose}
      >
        <DialogTitle variant="h2" fontWeight="bold">
          Application Submitted
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have successfully applied for the badge. Thank you for your
            submission!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleApplicationConfirmationClose}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pending badge message dialog */}
      <Dialog
        open={showPendingBadgeMessage}
        onClose={handlePendingBadgeMessageClose}
      >
        <DialogTitle variant="h2" fontWeight="bold">
          Badge is Pending
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have already applied for this badge, and it is pending approval.
            You can't apply again until the pending request is processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePendingBadgeMessageClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manager's proposal pending message dialog */}
      <Dialog
        open={showManagerProposalMessage}
        onClose={handleManagerProposalMessageClose}
      >
        <DialogTitle variant="h2" fontWeight="bold">
          Manager's Proposal Pending
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your manager has already proposed this badge for you. You can't
            apply again until your manager's proposal is processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleManagerProposalMessageClose}
            variant="contained"
          >
            Close
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/engineer/proposals")}
          >
            View Proposal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Badge request message dialog */}
      <Dialog
        open={showBadgeRequestedMessage}
        onClose={handleBadgeRequestedMessageClose}
      >
        <DialogTitle variant="h2" fontWeight="bold">
          Badge requested
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You are already in a process to get this badge!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleBadgeRequestedMessageClose}
            variant="contained"
          >
            Close
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/engineer/issuing_request`)}
          >
            Fill evidences
          </Button>
        </DialogActions>
      </Dialog>

      {/* Badge issued message dialog */}
      <Dialog
        open={showBadgeIssuedMessage}
        onClose={handleBadgeIssuedMessageClose}
      >
        <DialogTitle variant="h2" fontWeight="bold">
          Request issued
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have already submitted an issue request for this page. Please wait until your manager responds!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleBadgeIssuedMessageClose}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <hr />
    </BasicPage>
  );
};

export default Engineer;
