import { useContext, useState } from "react";
import { gql, useQuery, useMutation, resetApolloContext } from "@apollo/client";
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

const GET_BADGES_VERSIONS = gql`
  query MyQuery {
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
  mutation MyMutation(
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
  query MyQuery($engineerId: Int!) {
    users_relations(where: { engineer: { _eq: $engineerId } }) {
      userByManager {
        id
        name
      }
    }
  }
`;

const Engineer = () => {
  const { user_id } = useContext(AuthContext);
  const r3 = useQuery(GET_BADGES_VERSIONS);
  const rManager = useQuery(GET_MANAGER_BY_ENGINEER, {
    variables: {
      engineerId: user_id
    }
  });
  console.log("manager", rManager);
  const [addRequest, r4] = useMutation(ADD_REQUEST);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);

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

  // const handleDescriptionChange = (event, index) => {
  //   const updatedDescriptions = [...descriptions];
  //   updatedDescriptions[index] = event.target.value;
  //   setDescriptions(updatedDescriptions);
  // };

  // const handleManagerChange = (e, value) => {
  //   console.log(value);
  //   setSelectedManager(value);
  // };

  const handleOpenModal = (badge) => {
    setSelectedBadge(badge);
    setOpenModal(true);
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
      } catch (error) {
        console.error("Error submitting application:", error);
      }
    }
  };

  const handleApplicationConfirmationClose = () => {
    setIsApplicationSubmitted(false);
  };

  const isManagerListEmpty = !rManager.data?.users_relations?.length;

  if (r3.loading || rManager.loading) return "loading...";
  if (r3.error || rManager.error) throw r3.error || rManager.error;

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

      <hr />
    </BasicPage>
  );
};

export default Engineer;

