// // //v2
// import { useContext, useState } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import { TextField, FormGroup, Button, Select, MenuItem } from "@mui/material";
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
//   // const rManager = useQuery(GET_MANAGER_BY_ENGINEER);
//   const rManager = useQuery(GET_MANAGER_BY_ENGINEER, {
//     variables: {
//       engineerId: user_id
//     }
//   });
//   console.log("manager", rManager);
//   const [addRequest, r4] = useMutation(ADD_REQUEST);
//   const [descriptions, setDescriptions] = useState([]);
//   const [selectedManagerId, setSelectedManagerId] = useState("");

//   const handleDescriptionChange = (event, index) => {
//     const updatedDescriptions = [...descriptions];
//     updatedDescriptions[index] = event.target.value;
//     setDescriptions(updatedDescriptions);
//   };

//   const handleManagerChange = (event) => {
//     setSelectedManagerId(event.target.value);
//   };

//   const dothis = (badgeId, description, badgeVersion, index, user_id) => {
//     addRequest({
//       variables: {
//         badge_id: badgeId,
//         manager: selectedManagerId,
//         proposal_description: description,
//         badge_version: badgeVersion,
//         created_by: user_id
//       }
//     });
//   };

//   if (r3.loading || rManager.loading) return "loading...";
//   if (r3.error || rManager.error) throw r3.error || rManager.error;

//   return (
//     <BasicPage fullpage title="Badges Versions" subtitle="Engineer">
//       <div>
//         {r3.data.badges_versions_last.map((badge, index) => (
//           <div key={badge.id}>
//             <h5>{badge.title}</h5>
//             <p>{badge.description}</p>
//             <form key={badge.id}>
//               <FormGroup>
//                 <TextField
//                   id={`outlined-basic-${badge.id}`}
//                   label="Motivation Description"
//                   variant="outlined"
//                   value={descriptions[index] || ""}
//                   onChange={(event) => handleDescriptionChange(event, index)}
//                 />
//               </FormGroup>
//               <FormGroup>
//                 <Select
//                   value={selectedManagerId[index] || ""}
//                   onChange={(event) => handleManagerChange(event, index)}
//                   displayEmpty
//                   variant="outlined"
//                 >
//                   <MenuItem value="" disabled>
//                     Select Manager
//                   </MenuItem>
//                   {rManager.data?.users_relations.map((relation) => (
//                     <MenuItem
//                       key={relation.userByManager.id}
//                       value={relation.userByManager.id}
//                     >
//                       {relation.userByManager.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormGroup>
//             </form>
//             <Button
//               variant="contained"
//               onClick={() =>
//                 dothis(
//                   badge.id,
//                   descriptions[index],
//                   badge.created_at,
//                   index,
//                   user_id
//                 )
//               }
//             >
//               Apply
//             </Button>
//           </div>
//         ))}
//       </div>
//       <hr />
//     </BasicPage>
//   );
// };

// export default Engineer;

//
import { useContext, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  TextField,
  FormGroup,
  Button,
  Select,
  MenuItem,
  Alert
} from "@mui/material";
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
  // const rManager = useQuery(GET_MANAGER_BY_ENGINEER);
  const rManager = useQuery(GET_MANAGER_BY_ENGINEER, {
    variables: {
      engineerId: user_id
    }
  });
  console.log("manager", rManager);
  const [addRequest, r4] = useMutation(ADD_REQUEST);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState("");

  const handleDescriptionChange = (event, index) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = event.target.value;
    setDescriptions(updatedDescriptions);
  };

  const handleManagerChange = (event) => {
    setSelectedManagerId(event.target.value);
  };

  const dothis = (badgeId, description, badgeVersion, index, user_id) => {
    addRequest({
      variables: {
        badge_id: badgeId,
        manager: selectedManagerId,
        proposal_description: description,
        badge_version: badgeVersion,
        created_by: user_id
      }
    });
  };

  const isManagerListEmpty = !rManager.data?.users_relations?.length;

  if (r3.loading || rManager.loading) return "loading...";
  if (r3.error || rManager.error) throw r3.error || rManager.error;

  return (
    <BasicPage fullpage title="Badges Versions" subtitle="Engineer">
      {isManagerListEmpty && (
        <Alert severity="info">
          You can't apply for a badge because you don't have a manager!
        </Alert>
      )}
      <div>
        {r3.data.badges_versions_last.map((badge, index) => (
          <div key={badge.id}>
            <h5>{badge.title}</h5>
            <p>{badge.description}</p>
            <form key={badge.id}>
              <FormGroup>
                <TextField
                  id={`outlined-basic-${badge.id}`}
                  label="Motivation Description"
                  variant="outlined"
                  value={descriptions[index] || ""}
                  onChange={(event) => handleDescriptionChange(event, index)}
                  disabled={isManagerListEmpty}
                />
              </FormGroup>
              <FormGroup>
                <Select
                  value={selectedManagerId[index] || ""}
                  onChange={(event) => handleManagerChange(event, index)}
                  displayEmpty
                  variant="outlined"
                  disabled={isManagerListEmpty}
                >
                  <MenuItem value="" disabled>
                    Select Manager
                  </MenuItem>
                  {rManager.data?.users_relations.map((relation) => (
                    <MenuItem
                      key={relation.userByManager.id}
                      value={relation.userByManager.id}
                    >
                      {relation.userByManager.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormGroup>
            </form>
            <Button
              variant="contained"
              onClick={() =>
                dothis(
                  badge.id,
                  descriptions[index],
                  badge.created_at,
                  index,
                  user_id
                )
              }
              disabled={isManagerListEmpty}
            >
              Apply
            </Button>
          </div>
        ))}
      </div>
      <hr />
    </BasicPage>
  );
};

export default Engineer;
