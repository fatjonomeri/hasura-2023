import { useContext, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
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

const GET_APPROVED_BADGES = gql`
  query MyQuery {
    issuing_requests(where: { is_approved: { _eq: true } }) {
      request_id
    }
  }
`;

const GET_ACQUIRED_BADGES = gql`
  query MyQuery($engineerId: Int!, $id: Int!) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, id: { _eq: $id } }
    ) {
      badge_title
      candidature_evidences
      badge_description
      engineer_name
      engineer_id
    }
  }
`;

const AcquiredBadges = () => {
  const { user_id } = useContext(AuthContext);
  const [requestId, setRequestId] = useState("");

  const { loading, error, data } = useQuery(GET_APPROVED_BADGES);

  useEffect(() => {
    if (data) {
      setRequestId(data?.issuing_requests[0]?.request_id);
    }
  }, [data]);

  const r8 = useQuery(GET_ACQUIRED_BADGES, {
    variables: {
      engineerId: user_id,
      id: requestId
    }
  });
  console.log("r8", r8);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <BasicPage fullpage title="Badges Versions" subtitle="Engineer">
      {r8.data?.badge_candidature_view?.length === 0 ||
      r8.data?.badge_candidature_view?.length === undefined ? (
        <p>No acquired badges found.</p>
      ) : (
        r8.data?.badge_candidature_view?.map((badge) => (
          <div key={badge.id}>
            <h3>Badge Title: {badge.badge_title}</h3>
            <p>Badge Version: {badge.badge_description}</p>
          </div>
        ))
      )}
    </BasicPage>
  );
};

export default AcquiredBadges;