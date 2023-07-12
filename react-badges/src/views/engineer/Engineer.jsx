// import { useState } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import { TextField, FormGroup, Button } from "@mui/material";
// import BasicPage from "../../layouts/BasicPage/BasicPage";

// const GET_BADGES_VERSIONS = gql`
//   query MyQuery {
//     badges_versions_last {
//       id
//       title
//       description
//       requirements
//     }
//   }
// `;

// const ADD_REQUEST = gql`
//   mutation MyMutation(
//     $badge_id: Int!
//     $manager: Int!
//     $proposal_description: String!
//     $badge_version: timestamp
//   ) {
//     insert_engineer_to_manager_badge_candidature_proposals_one(
//       object: {
//         badge_id: $badge_id
//         manager: $manager
//         proposal_description: $proposal_description
//         badge_version: $badge_version
//       }
//     ) {
//       id
//     }
//   }
// `;

// const Engineer = () => {
//   const r3 = useQuery(GET_BADGES_VERSIONS);
//   const [addRequest, r4] = useMutation(ADD_REQUEST);
//   const [description, setDescription] = useState("");
//   console.log("data:", r3);

//   const handleDescriptionChange = (event) => {
//     setDescription(event.target.value);
//   };

//   const dothis = () => {
//     addRequest({
//       variables: {
//         badge_id: 1,
//         manager: 1,
//         proposal_description: description,
//         badge_version: "2023-07-12 07:41:55.647068"
//       }
//     });
//   };
//   console.log("aa");

//   return (
//     <BasicPage fullpage title="Badges Versions" subtitle="Engineer">
//       <div>
//         {r3.data?.badges_versions_last.map((badge) => (
//           <div key={badge.id}>
//             <h5>{badge.title}</h5>
//             <p>{badge.description}</p>
//             <form key={badge.id}>
//               <FormGroup>
//                 <TextField
//                   id="outlined-basic"
//                   label="Motivation Description"
//                   variant="outlined"
//                   value={description}
//                   onChange={handleDescriptionChange}
//                 />
//               </FormGroup>
//             </form>
//             <Button variant="contained" onClick={dothis}>
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
import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { TextField, FormGroup, Button } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";

const GET_BADGES_VERSIONS = gql`
  query MyQuery {
    badges_versions_last {
      id
      title
      description
      requirements
    }
  }
`;

const ADD_REQUEST = gql`
  mutation MyMutation(
    $badge_id: Int!
    $manager: Int!
    $proposal_description: String!
    $badge_version: timestamp
  ) {
    insert_engineer_to_manager_badge_candidature_proposals_one(
      object: {
        badge_id: $badge_id
        manager: $manager
        proposal_description: $proposal_description
        badge_version: $badge_version
      }
    ) {
      id
    }
  }
`;

const Engineer = () => {
  const r3 = useQuery(GET_BADGES_VERSIONS);
  const [addRequest, r4] = useMutation(ADD_REQUEST);
  const [descriptions, setDescriptions] = useState([]);
  console.log("data:", r3);

  const handleDescriptionChange = (event, index) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = event.target.value;
    setDescriptions(updatedDescriptions);
  };

  const dothis = (badgeId, description, badgeVersion, index) => {
    addRequest({
      variables: {
        badge_id: badgeId,
        manager: 1,
        proposal_description: description,
        badge_version: badgeVersion
      }
    });
  };

  if (r3.loading) return "loading...";
  if (r3.error) throw r3.error;

  console.log("aa");

  return (
    <BasicPage fullpage title="Badges Versions" subtitle="Engineer">
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
                />
              </FormGroup>
            </form>
            <Button
              variant="contained"
              onClick={() =>
                dothis(
                  badge.id,
                  descriptions[index],
                  "2023-07-12 07:41:55.647068",
                  index
                )
              }
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
