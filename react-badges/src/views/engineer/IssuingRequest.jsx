// import React, { useContext, useEffect, useState } from "react";
// import {
//   gql,
//   useQuery,
//   useMutation,
//   useApolloClient,
//   useLazyQuery
// } from "@apollo/client";
// import BasicPage from "../../layouts/BasicPage/BasicPage";
// import { AuthContext } from "../../state/with-auth";
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Button,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// const GET_CANDIDATURES = gql`
//   query MyQuery($engineerId: Int!) {
//     badge_candidature_view(where: { engineer_id: { _eq: $engineerId } }) {
//       badge_id
//       badge_title
//       badge_description
//     }
//   }
// `;

// const IssuingRequest = () => {
//   const { user_id } = useContext(AuthContext);

//   const { loading, error, data } = useQuery(GET_CANDIDATURES, {
//     variables: { engineerId: user_id }
//   });

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   const candidatures = data.badge_candidature_view;
//   console.log("prove", candidatures);

//   return (
//     <BasicPage fullpage title="Requirements" subtitle="Engineer">
//       {candidatures.map((item, index) => (
//         <Card key={item.id} variant="outlined" sx={{ mb: 2, mt: "10px" }}>
//           <CardContent>
//             <Typography variant="h5" component="h2">
//               {item.badge_title}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               marginTop="5px"
//               marginBottom="5px"
//             >
//               {item.badge_description}
//             </Typography>
//             <Button variant="outlined">View Requirements</Button>
//           </CardContent>
//         </Card>
//       ))}
//     </BasicPage>
//   );
// };

// export default IssuingRequest;

import React, { useContext, useEffect, useState } from "react";
import {
  gql,
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery
} from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const GET_CANDIDATURES = gql`
  query MyQuery($engineerId: Int!) {
    badge_candidature_view(where: { engineer_id: { _eq: $engineerId } }) {
      badge_id
      badge_title
      badge_description
    }
  }
`;

const IssuingRequest = () => {
  const { user_id } = useContext(AuthContext);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_CANDIDATURES, {
    variables: { engineerId: user_id }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const candidatures = data.badge_candidature_view;
  console.log("prove", candidatures);

  const handleViewRequirements = (badgeId) => {
    navigate(`requirements/${badgeId}`);
  };

  return (
    <BasicPage fullpage title="Submit An Issuing Request" subtitle="Engineer">
      {candidatures.map((item, index) => (
        <Card key={item.badge_id} variant="outlined" sx={{ mb: 2, mt: "10px" }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {item.badge_title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              marginTop="5px"
              marginBottom="5px"
            >
              {item.badge_description}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => handleViewRequirements(item.badge_id)}
            >
              View Requirements
            </Button>
          </CardContent>
        </Card>
      ))}
    </BasicPage>
  );
};

export default IssuingRequest;
