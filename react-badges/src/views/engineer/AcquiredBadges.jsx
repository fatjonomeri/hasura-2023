import { useContext } from "react";
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

const GET_ACQUIRED_BADGES = gql`
  query MyQuery($engineerId: Int!) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, is_issued: { _eq: true } }
    ) {
      badge_title
      badge_version
      badge_description
      candidature_evidences
    }
    issuing_requests(where: { is_approved: { _eq: true } }) {
      request_id
    }
  }
`;

const AcquiredBadges = () => {
  const { user_id } = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_ACQUIRED_BADGES, {
    variables: {
      engineerId: user_id
    }
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <BasicPage fullpage title="Badges Versions" subtitle="Engineer">
      {data.badge_candidature_view.length === 0 ? (
        <p>No acquired badges found.</p>
      ) : (
        data.badge_candidature_view.map((badge) => (
          <div key={badge.id}>
            <h3>Badge ID: {badge.badge_title}</h3>
            <p>Badge Description: {badge.badge_description}</p>
            <p>Badge Version: {badge.badge_version}</p>
            <p>Candidature evidences: {badge.candidature_evidences}</p>
          </div>
        ))
      )}
    </BasicPage>
  );
};

export default AcquiredBadges;
