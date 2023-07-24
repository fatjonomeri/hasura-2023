// import React, { useContext } from "react";
// import { gql, useQuery } from "@apollo/client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box
// } from "@mui/material";
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { AuthContext } from "../../state/with-auth";

// const ACCEPTED_DECLINED_PROPOSALS = gql`
// query MyQuery($engineerId: Int!) {
//   manager_to_engineer_badge_candidature_proposals(where: {engineer: {_eq: $engineerId}}) {
//     badges_version {
//       title
//     }
//     engineer_badge_candidature_proposal_responses {
//       disapproval_motivation
//       is_approved
    
//     }
//     user {
//       name
//     }
//   }
// }
// `;

// const ACCEPTED_DECLINED_PROPOSALS_FROM_MANAGER = gql`
//   query MyQuery($engineerId: Int!) {
//     engineer_to_manager_badge_candidature_proposals(
//       where: { created_by: { _eq: $engineerId } }
//     ) {
//       id
//       manager_badge_candidature_proposal_responses {
//         disapproval_motivation
//         is_approved
//       }
//       badges_version {
//         title
//       }
//       userByManager {
//         name
//       }
//     }
//   }
// `;

// const BadgesStatus = () => {
//   const { user_id } = useContext(AuthContext);

//   const { loading: approvedLoading, error: approvedError, data: approvedData } =
//     useQuery(ACCEPTED_DECLINED_PROPOSALS, {
//       variables: {
//         engineerId: user_id
//       }
//     });

//   const { loading: applicationsLoading, error: applicationsError, data: applicationsData } =
//     useQuery(ACCEPTED_DECLINED_PROPOSALS_FROM_MANAGER, {
//       variables: {
//         engineerId: user_id
//       }
//     });

//   if (approvedLoading || applicationsLoading) {
//     return <div>Loading...</div>;
//   }

//   if (approvedError) {
//     return <div>Error: {approvedError.message}</div>;
//   }

//   if (applicationsError) {
//     return <div>Error: {applicationsError.message}</div>;
//   }

//   const approvedProposals = approvedData.manager_to_engineer_badge_candidature_proposals;
//   // console.log("dT",approvedProposals)
//   const applicationsFromEngineer = applicationsData.engineer_to_manager_badge_candidature_proposals;
//   console.log('gggggggg', applicationsFromEngineer)

//   return (
//     <BasicPage fullpage title="Badges Status" subtitle="Engineer">
//       <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
//         Here is the status of your candidature proposals for badges:
//       </Typography>
//       <Box sx={{ mt: 2 }}>
//         <Typography variant="h4" gutterBottom>
//          Proposals From Manager
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Badge Title</TableCell>
//                 <TableCell>Badge Status</TableCell>
//                 <TableCell>Manager Name</TableCell>
//                 <TableCell>Disapproval Motivation</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {approvedProposals.map((proposal) => (
//                 <TableRow key={proposal.badges_version.title}>
//                   <TableCell>
//                     {proposal.badges_version?.title}
//                   </TableCell>
//                   <TableCell>
//                   {proposal.engineer_badge_candidature_proposal_responses[0]?.is_approved ? "Accepted" : proposal.engineer_badge_candidature_proposal_responses[0]?.is_approved === false ? "Rejected" : "Pending"}
//                   </TableCell>
//                   <TableCell>
//                     {proposal.user?.name || "-"}
//                   </TableCell>
//                   <TableCell>
//                     {proposal.engineer_badge_candidature_proposal_responses[0]?.disapproval_motivation || "-"}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//       <Box sx={{ mt: 2 }}>
//         <Typography variant="h4" gutterBottom>
//           Applications from Engineer
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Badge Title</TableCell>
//                 <TableCell>Badge Status</TableCell>
//                 <TableCell>Manager Name</TableCell>
//                 <TableCell>Disapproval Motivation</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {applicationsFromEngineer.map((application) => (
//                 <TableRow key={application.badges_version.title}>
//                   <TableCell>
//                     {application.badges_version.title}
//                   </TableCell>
//                   <TableCell>
//                   {application.manager_badge_candidature_proposal_responses[0]?.is_approved ? "Accepted" : application.manager_badge_candidature_proposal_responses[0]?.is_approved === false ? "Rejected" : "Pending"}                  </TableCell>
//                   <TableCell>
//                     {application.userByManager?.name || "-"}
//                   </TableCell>
//                   <TableCell>
//                     {application.manager_badge_candidature_proposal_responses[0]?.disapproval_motivation || "-"}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </BasicPage>
//   );
// };

// export default BadgesStatus;


/////////////////////////reusable
import React, { useContext, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Typography, Box, Paper, Tab, Tabs } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import EngineerApplicationsTable from "./ComponentsEngineer/EngineerApplicationsTable ";
import ManagerProposalsTable from "./ComponentsEngineer/ManagerProposalsTable ";

const ACCEPTED_DECLINED_PROPOSALS = gql`
query MyQuery($engineerId: Int!) {
  manager_to_engineer_badge_candidature_proposals(where: {engineer: {_eq: $engineerId}}) {
    badges_version {
      title
    }
    engineer_badge_candidature_proposal_responses {
      disapproval_motivation
      is_approved
    
    }
    user {
      name
    }
  }
}
`;

const ACCEPTED_DECLINED_PROPOSALS_FROM_MANAGER = gql`
  query MyQuery($engineerId: Int!) {
    engineer_to_manager_badge_candidature_proposals(
      where: { created_by: { _eq: $engineerId } }
    ) {
      id
      manager_badge_candidature_proposal_responses {
        disapproval_motivation
        is_approved
      }
      badges_version {
        title
      }
      userByManager {
        name
      }
    }
  }
`;

const BadgesStatus = () => {
  const { user_id } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState(0);

  const { loading: approvedLoading, error: approvedError, data: approvedData, refetch: refetchApprovedData } =
    useQuery(ACCEPTED_DECLINED_PROPOSALS, {
      variables: {
        engineerId: user_id
      }
    });

  const { loading: applicationsLoading, error: applicationsError, data: applicationsData, refetch: refetchApplicationData } =
    useQuery(ACCEPTED_DECLINED_PROPOSALS_FROM_MANAGER, {
      variables: {
        engineerId: user_id
      }
    });
    useEffect(()=>{
      refetchApplicationData();
      refetchApprovedData();
      
    },[]);

  if (approvedLoading || applicationsLoading) {
    return <div>Loading...</div>;
  }

  if (approvedError) {
    return <div>Error: {approvedError.message}</div>;
  }

  if (applicationsError) {
    return <div>Error: {applicationsError.message}</div>;
  }

  const approvedProposals = approvedData.manager_to_engineer_badge_candidature_proposals;
  // console.log("dT",approvedProposals)
  const applicationsFromEngineer = applicationsData.engineer_to_manager_badge_candidature_proposals;
  console.log('gggggggg', applicationsFromEngineer)

  // return (
  //   <BasicPage fullpage title="Badges Status" subtitle="Engineer">
  //     <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
  //       Here is the status of your candidature proposals for badges:
  //     </Typography>
  //     <Box sx={{ mt: 2 }}>
  //       <Typography variant="h4" gutterBottom>
  //         Proposals From Manager
  //       </Typography>
  //       <ManagerProposalsTable proposals={approvedProposals} />
        
  //     </Box>
  //     <Box sx={{ mt: 2 }}>
  //       <Typography variant="h4" gutterBottom>
  //         Applications from Engineer
  //       </Typography>
  //       <EngineerApplicationsTable applications={applicationsFromEngineer} />
        
  //     </Box>
  //   </BasicPage>
  // );

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };



  return (
    <BasicPage fullpage title="Badges Status" subtitle="Engineer">
      <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
        Here is the status of your candidature proposals for badges:
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Paper sx={{ width: "100%", marginBottom: 2 }}>
          <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
            <Tab label="Proposals From Manager" />
            <Tab label="Applications from Engineer" />
          </Tabs>
        </Paper>
        {currentTab === 0 && <ManagerProposalsTable proposals={approvedProposals} />}
        {currentTab === 1 && <EngineerApplicationsTable applications={applicationsFromEngineer} />}
      </Box>
    </BasicPage>
  );
};


export default BadgesStatus;



