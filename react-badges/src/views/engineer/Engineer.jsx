/////////////////////punon
// import { useContext, useState } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import {
//   TextField,
//   FormGroup,
//   Button,
//   Select,
//   MenuItem,
//   Alert,
//   Card,
//   CardContent,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from "@mui/material";
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { AuthContext } from "../../state/with-auth";

// const GET_BADGES_VERSIONS = gql`
//   query MyQuery {
//     badges_versions_last {
//       id
//       title
//       description
//       requirements
//       created_at
//     }
//   }
// `;

// const ADD_REQUEST = gql`
//   mutation MyMutation(
//     $badge_id: Int!
//     $manager: Int!
//     $proposal_description: String!
//     $badge_version: timestamp
//     $created_by: Int!
//   ) {
//     insert_engineer_to_manager_badge_candidature_proposals_one(
//       object: {
//         badge_id: $badge_id
//         manager: $manager
//         proposal_description: $proposal_description
//         badge_version: $badge_version
//         created_by: $created_by
//       }
//     ) {
//       id
//     }
//   }
// `;

// const GET_MANAGER_BY_ENGINEER = gql`
//   query MyQuery($engineerId: Int!) {
//     users_relations(where: { engineer: { _eq: $engineerId } }) {
//       userByManager {
//         id
//         name
//       }
//     }
//   }
// `;

// const Engineer = () => {
//   const { user_id } = useContext(AuthContext);
//   const r3 = useQuery(GET_BADGES_VERSIONS);
//   const rManager = useQuery(GET_MANAGER_BY_ENGINEER, {
//     variables: {
//       engineerId: user_id
//     }
//   });
//   console.log("manager", rManager);
//   const [addRequest, r4] = useMutation(ADD_REQUEST);
//   const [descriptions, setDescriptions] = useState([]);
//   const [selectedManagerId, setSelectedManagerId] = useState("");
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedBadge, setSelectedBadge] = useState(null);

//   const handleDescriptionChange = (event, index) => {
//     const updatedDescriptions = [...descriptions];
//     updatedDescriptions[index] = event.target.value;
//     setDescriptions(updatedDescriptions);
//   };

//   const handleManagerChange = (event) => {
//     setSelectedManagerId(event.target.value);
//   };

//   const handleOpenModal = (badge) => {
//     setSelectedBadge(badge);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleConfirmApplication = () => {
//     if (selectedBadge) {
//       const { id, created_at } = selectedBadge;
//       addRequest({
//         variables: {
//           badge_id: id,
//           manager: selectedManagerId,
//           proposal_description: descriptions[selectedBadge.index],
//           badge_version: created_at,
//           created_by: user_id
//         }
//       });
//       setOpenModal(false);
//       setDescriptions([]);
//     }
//   };

//   const isManagerListEmpty = !rManager.data?.users_relations?.length;

//   if (r3.loading || rManager.loading) return "loading...";
//   if (r3.error || rManager.error) throw r3.error || rManager.error;

//   return (
//     <BasicPage fullpage title="Available Badges" subtitle="Engineer">
//       <br />
//       {isManagerListEmpty && (
//         <Alert severity="info" sx={{ marginBottom: "12px" }}>
//           You can't apply for a badge because you don't have a manager!
//         </Alert>
//       )}
//       <div>
//         {r3.data.badges_versions_last.map((badge, index) => (
//           <Card key={badge.id} variant="outlined" sx={{ mb: 2 }}>
//             <CardContent>
//               <Typography variant="h5" component="h2">
//                 {badge.title}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 marginTop="5px"
//                 marginBottom="5px"
//               >
//                 {badge.description}
//               </Typography>
//               <Button
//                 variant="contained"
//                 onClick={() => handleOpenModal({ ...badge, index })}
//                 disabled={isManagerListEmpty}
//               >
//                 Apply
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//       <Dialog open={openModal} onClose={handleCloseModal}>
//         <DialogTitle variant="h2" fontWeight="bold">
//           Confirm Application
//           <Typography variant="body2" marginTop="5px">
//             Write a motivation description for the badge you are applying and
//             select the manager you are sending this application to.
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <FormGroup sx={{ marginBottom: "12px" }}>
//             <Select
//               value={selectedManagerId[selectedBadge?.index || ""]}
//               onChange={handleManagerChange}
//               displayEmpty
//               variant="outlined"
//               disabled={isManagerListEmpty}
//               fullWidth
//             >
//               <MenuItem disabled>Select Manager</MenuItem>
//               {rManager.data?.users_relations.map((relation) => (
//                 <MenuItem
//                   key={relation.userByManager.id}
//                   value={relation.userByManager.id}
//                 >
//                   {relation.userByManager.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormGroup>
//           <FormGroup>
//             <TextField
//               id="outlined-basic-description"
//               label="Motivation Description"
//               variant="outlined"
//               value={descriptions[selectedBadge?.index] || ""}
//               onChange={(event) =>
//                 handleDescriptionChange(event, selectedBadge?.index)
//               }
//               disabled={isManagerListEmpty}
//               fullWidth
//               multiline
//               rows={4}
//             />
//           </FormGroup>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal}>Cancel</Button>
//           <Button onClick={handleConfirmApplication} variant="contained">
//             Confirm Application
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <hr />
//     </BasicPage>
//   );
// };

// export default Engineer;

///autocomplete
// import { useContext, useState } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import {
//   TextField,
//   FormGroup,
//   Button,
//   Alert,
//   Card,
//   CardContent,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from "@mui/material";
// import Autocomplete from "@mui/material/Autocomplete"; // Add this import
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { AuthContext } from "../../state/with-auth";

// const GET_BADGES_VERSIONS = gql`
//   query MyQuery {
//     badges_versions_last {
//       id
//       title
//       description
//       requirements
//       created_at
//     }
//   }
// `;

// const ADD_REQUEST = gql`
//   mutation MyMutation(
//     $badge_id: Int!
//     $manager: Int!
//     $proposal_description: String!
//     $badge_version: timestamp
//     $created_by: Int!
//   ) {
//     insert_engineer_to_manager_badge_candidature_proposals_one(
//       object: {
//         badge_id: $badge_id
//         manager: $manager
//         proposal_description: $proposal_description
//         badge_version: $badge_version
//         created_by: $created_by
//       }
//     ) {
//       id
//     }
//   }
// `;

// const GET_MANAGER_BY_ENGINEER = gql`
//   query MyQuery($engineerId: Int!) {
//     users_relations(where: { engineer: { _eq: $engineerId } }) {
//       userByManager {
//         id
//         name
//       }
//     }
//   }
// `;

// const Engineer = () => {
//   const { user_id } = useContext(AuthContext);
//   const r3 = useQuery(GET_BADGES_VERSIONS);
//   const rManager = useQuery(GET_MANAGER_BY_ENGINEER, {
//     variables: {
//       engineerId: user_id
//     }
//   });
//   console.log("manager", rManager);
//   const [addRequest, r4] = useMutation(ADD_REQUEST);
//   const [descriptions, setDescriptions] = useState([]);
//   const [selectedManager, setSelectedManager] = useState(""); // Updated to store the selected manager object
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedBadge, setSelectedBadge] = useState(null);

//   const handleDescriptionChange = (event, index) => {
//     const updatedDescriptions = [...descriptions];
//     updatedDescriptions[index] = event.target.value;
//     setDescriptions(updatedDescriptions);
//   };

//   const handleManagerChange = (event, value) => {
//     // console.log("event", event.target.value);
//     setSelectedManager(value); // Use the selected value (manager object) from the Autocomplete
//   };

//   const handleOpenModal = (badge) => {
//     setSelectedBadge(badge);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleConfirmApplication = () => {
//     console.log("mngr", selectedManager.userByManager.id);
//     if (selectedBadge) {
//       const { id, created_at } = selectedBadge;
//       addRequest({
//         variables: {
//           badge_id: id,
//           manager: selectedManager.userByManager.id,
//           proposal_description: descriptions[selectedBadge.index],
//           badge_version: created_at,
//           created_by: user_id
//         }
//       });
//       setOpenModal(false);
//       setDescriptions([]);
//     }
//   };

//   const isManagerListEmpty = !rManager.data?.users_relations?.length;

//   if (r3.loading || rManager.loading) return "loading...";
//   if (r3.error || rManager.error) throw r3.error || rManager.error;

//   return (
//     <BasicPage fullpage title="Available Badges" subtitle="Engineer">
//       <br />
//       {isManagerListEmpty && (
//         <Alert severity="info" sx={{ marginBottom: "12px" }}>
//           You can't apply for a badge because you don't have a manager!
//         </Alert>
//       )}
//       <div>
//         {r3.data.badges_versions_last.map((badge, index) => (
//           <Card key={badge.id} variant="outlined" sx={{ mb: 2 }}>
//             <CardContent>
//               <Typography variant="h5" component="h2">
//                 {badge.title}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 marginTop="5px"
//                 marginBottom="5px"
//               >
//                 {badge.description}
//               </Typography>
//               <Button
//                 variant="contained"
//                 onClick={() => handleOpenModal({ ...badge, index })}
//                 disabled={isManagerListEmpty}
//               >
//                 Apply
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//       <Dialog open={openModal} onClose={handleCloseModal}>
//         <DialogTitle variant="h2" fontWeight="bold">
//           Confirm Application
//           <Typography variant="body2" marginTop="5px">
//             Write a motivation description for the badge you are applying and
//             select the manager you are sending this application to.
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <FormGroup sx={{ marginBottom: "12px" }}>
//             <Autocomplete
//               value={selectedManager[selectedBadge?.index]}
//               onChange={handleManagerChange}
//               options={rManager.data?.users_relations || []}
//               getOptionLabel={(option) => option.userByManager.name}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select Manager"
//                   variant="outlined"
//                   disabled={isManagerListEmpty}
//                   fullWidth
//                 />
//               )}
//             />
//           </FormGroup>
//           <FormGroup>
//             <TextField
//               id="outlined-basic-description"
//               label="Motivation Description"
//               variant="outlined"
//               value={descriptions[selectedBadge?.index] || ""}
//               onChange={(event) =>
//                 handleDescriptionChange(event, selectedBadge?.index)
//               }
//               disabled={isManagerListEmpty}
//               fullWidth
//               multiline
//               rows={4}
//             />
//           </FormGroup>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal}>Cancel</Button>
//           <Button onClick={handleConfirmApplication} variant="contained">
//             Confirm Application
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <hr />
//     </BasicPage>
//   );
// };

// export default Engineer;


import { useContext, useState } from "react";
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
import Autocomplete from "@mui/material/Autocomplete"; // Add this import
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";

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
  const [selectedManager, setSelectedManager] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);

  const handleDescriptionChange = (event, index) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = event.target.value;
    setDescriptions(updatedDescriptions);
  };

  const handleManagerChange = (event, value) => {
    // console.log("evv", value);
    setSelectedManager(value);
  };

  const handleOpenModal = (badge) => {
    setSelectedBadge(badge);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmApplication = async () => {
    if (selectedBadge) {
      const { id, created_at } = selectedBadge;
      try {
        await addRequest({
          variables: {
            badge_id: id,
            manager: selectedManager.userByManager.id,
            proposal_description: descriptions[selectedBadge.index],
            badge_version: created_at,
            created_by: user_id
          }
        });
        setOpenModal(false);
        setDescriptions([]);
        setIsApplicationSubmitted(true);
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
          <FormGroup sx={{ marginBottom: "10px" }}>
            <Autocomplete
              sx={{ mt: "8px" }}
              value={selectedManager[selectedBadge?.index]}
              onChange={handleManagerChange}
              options={rManager.data?.users_relations || []}
              getOptionLabel={(option) => option.userByManager.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Manager"
                  variant="outlined"
                  disabled={isManagerListEmpty}
                  fullWidth
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id="outlined-basic-description"
              label="Motivation Description"
              variant="outlined"
              value={descriptions[selectedBadge?.index] || ""}
              onChange={(event) =>
                handleDescriptionChange(event, selectedBadge?.index)
              }
              disabled={isManagerListEmpty}
              fullWidth
              multiline
              rows={4}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleConfirmApplication} variant="contained">
            Confirm Application
          </Button>
        </DialogActions>
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

