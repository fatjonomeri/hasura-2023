// import { useEffect, useState } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { Button } from "@mui/material";

// const GET_PROPOSALS_CANDIDATURE = gql`
// query MyQuery {
//   manager_to_engineer_badge_candidature_proposals(where: {engineer: {_eq: 1}}) {
//     badge_id
//     badges_version {
//       title
//       requirements
//       description
//     }
//     id
//   }
// }
// `;

// const ACCEPT_PROPOSAL = gql`
// mutation MyMutation(
//   $proposal_id: Int!
//   $is_approved: Boolean!
// ) {
//   update_engineer_badge_candidature_proposal_response(
//     where: { proposal_id: { _eq: $proposal_id } }
//     _set: { is_approved: $is_approved }
//   ) {
//     returning {
//       is_approved
//       disapproval_motivation
//       proposal_id
//       response_id
//     }
//   }
// }
// `

// const Proposals = () => {
//   const r7 = useQuery(GET_PROPOSALS_CANDIDATURE);
//   const [acceptProposal] = useMutation(ACCEPT_PROPOSAL);

//   const handleAcceptProposal = (proposalId) => {
//     acceptProposal({
//       variables: {
//         proposal_id: proposalId,
//         is_approved: true
//       }
//     })

//   };

//   if (r7.loading) return "loading...";
//   if (r7.error) throw r7.error;

//   return (
//     <BasicPage fullpage title="Engineer">
//       <div>
//         <h4>Proposals</h4>
//         {r7.data.manager_to_engineer_badge_candidature_proposals.map(
//           (badge) => (
//             <div key={badge.id}>
//               <h5>{badge.badges_version.title}</h5>
//               {badge.badges_version.requirements.map((b) => (
//                 <p>{b.title} </p>
//                 // <p>{b.description} </p>
//               ))}
//             <Button onClick={() => handleAcceptProposal(badge.id)}>Accept</Button>
//             <Button>Decline</Button>
//             </div>
//           )
//         )}
//       </div>
//       <hr />
//     </BasicPage>
//   );
// };

// export default Proposals;

/////////////////////////////////////////////////

import { useContext, useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { Button, TextField } from "@mui/material";
import { AuthContext } from "../../state/with-auth";

const GET_PROPOSALS_CANDIDATURE = gql`
 
  query MyQuery($engineerId: Int!) {
      manager_to_engineer_badge_candidature_proposals(
        where: { engineer: { _eq: $engineerId} }
      ) {
        badge_id
        badges_version {
          title
          requirements
          description
        }
        id
      }
    }
`;

const ACCEPT_PROPOSAL = gql`
  mutation MyMutation(
    $proposal_id: Int!
    $is_approved: Boolean!
    $disapproval_motivation: String!
  ) {
    update_engineer_badge_candidature_proposal_response(
      where: { proposal_id: { _eq: $proposal_id } }
      _set: {
        is_approved: $is_approved,
        disapproval_motivation: $disapproval_motivation
      }
    ) {
      returning {
        is_approved
        disapproval_motivation
        proposal_id
        response_id
      }
    }
  }
`;

// const Proposals = () => {
//   const r7 = useQuery(GET_PROPOSALS_CANDIDATURE);
//   const [acceptProposal] = useMutation(ACCEPT_PROPOSAL);
//   const [motivation, setMotivation] = useState("");
//   const [showMotivation, setShowMotivation] = useState(false);
//   const [selectedProposalId, setSelectedProposalId] = useState(null);

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
//       })
//       .catch((error) => {
//         console.error("Accept proposal error:", error);
//       });
//   };

//   const handleDeclineProposal = (proposalId) => {
//     setSelectedProposalId(proposalId);
//     setShowMotivation(true);
//   };

//   // const handleMotivationChange = (event) => {
//   //   setMotivation(event.target.value);

//   // };
//   const handleMotivationChange = (value, index) => {
//     //const updatedMotivations = [...motivation];
//     //console.log("updatedMotivations", updatedMotivations);
//     //updatedMotivations[index] = value;
//     console.log("valueee", value);
//     setMotivation(value);
//   };

//   const handleConfirmDecline = () => {
//     acceptProposal({
//       variables: {
//         proposal_id: selectedProposalId,
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

//   return (
//     <BasicPage fullpage title="Proposals">
//       <div>
//         <h4>Proposals</h4>
//         {r7.data.manager_to_engineer_badge_candidature_proposals.map(
//           (badge, index) => (
//             <div key={badge.id}>
//               <h5>{badge.badges_version.title}</h5>
//               {badge.badges_version.requirements.map((b) => (
//                 <p key={b.title}>{b.title}</p>
//               ))}
//               <Button onClick={() => handleAcceptProposal(badge.id)}>
//                 Accept
//               </Button>
//               <Button onClick={() => handleDeclineProposal(badge.id)}>
//                 Decline
//               </Button>
//               {showMotivation && selectedProposalId === badge.id && (
//                 <div>
//                   <TextField
//                     label="Motivation for decline"
//                     value={motivation}
//                     onChange={(event) =>
//                       handleMotivationChange((index, event.target.value))
//                     }
//                   />
//                   <Button onClick={() => handleConfirmDecline(badge.id)}>
//                     Confirm Decline
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )
//         )}
//       </div>
//       <hr />
//     </BasicPage>
//   );
// };

//proposals error
const Proposals = () => {
  const {user_id} = useContext(AuthContext);
  // const r7 = useQuery(GET_PROPOSALS_CANDIDATURE);
    const r7 = useQuery(GET_PROPOSALS_CANDIDATURE, {
      variables: {
        engineerId: user_id
      }
    });

  const [acceptProposal] = useMutation(ACCEPT_PROPOSAL);
  const [motivation, setMotivation] = useState("");
  const [showMotivation, setShowMotivation] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);

  const handleAcceptProposal = (proposalId) => {
    acceptProposal({
      variables: {
        proposal_id: proposalId,
        is_approved: true,
        disapproval_motivation: null
      }
    })
      .then((result) => {
        console.log("Accept proposal result:", result);
      })
      .catch((error) => {
        console.error("Accept proposal error:", error);
      });
  };

  const handleDeclineProposal = (proposalId) => {
    setSelectedProposalId(proposalId);
    setShowMotivation(true);
  };

  const handleMotivationChange = (value, index) => {
    console.log("valueee", value);
    setMotivation(value);
  };

  const handleConfirmDecline = () => {
    acceptProposal({
      variables: {
        proposal_id: selectedProposalId,
        is_approved: false,
        disapproval_motivation: motivation
      }
    })
      .then((result) => {
        console.log("Decline proposal result:", result);
        setShowMotivation(false);
        setSelectedProposalId(null);
        setMotivation("");
      })
      .catch((error) => {
        console.error("Decline proposal error:", error);
      });
  };

  if (r7.loading) return "loading...";
  if (r7.error) throw r7.error;

  const proposals = r7.data.manager_to_engineer_badge_candidature_proposals;

  return (
    <BasicPage fullpage title="Proposals">
      <div>
        <h4>Proposals</h4>
        {proposals.length === 0 ? (
          <p>No proposals available</p>
        ) : (
          proposals.map((badge, index) => (
            <div key={badge.id}>
              <h5>{badge.badges_version.title}</h5>
              {badge.badges_version.requirements.map((b) => (
                <p key={b.title}>{b.title}</p>
              ))}
              <Button onClick={() => handleAcceptProposal(badge.id)}>
                Accept
              </Button>
              <Button onClick={() => handleDeclineProposal(badge.id)}>
                Decline
              </Button>
              {showMotivation && selectedProposalId === badge.id && (
                <div>
                  <TextField
                    label="Motivation for decline"
                    value={motivation}
                    onChange={(event) =>
                      handleMotivationChange(event.target.value, index)
                    }
                  />
                  <Button onClick={() => handleConfirmDecline(badge.id)}>
                    Confirm Decline
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <hr />
    </BasicPage>
  );
};

export default Proposals;



