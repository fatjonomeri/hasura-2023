import { gql } from "@apollo/client";

//Engineer
export const GET_BADGES_VERSIONS = gql`
  query lastVersionBadges {
    badges_versions_last {
      id
      title
      description
      requirements
      created_at
    }
  }
`;

export const GET_MANAGER_BY_ENGINEER = gql`
  query managerByEngineer($engineerId: Int!) {
    users_relations(where: { engineer: { _eq: $engineerId } }) {
      userByManager {
        id
        name
      }
    }
  }
`;

export const GET_APPROVED_BADGES = gql`
  query wonBadges($engineerId: Int!) {
    badge_candidature_request(
      where: {
        issuing_requests: { is_approved: { _eq: true } }
        engineer_id: { _eq: $engineerId }
      }
    ) {
      id
      badge_id
      issuing_requests {
        request_id
      }
    }
  }
`;

export const GET_APPROVED_REQUESTS = gql`
  query approvedBadgeCandidatureRequest($engineerId: Int!) {
    badge_candidature_request(
      where: { is_issued: { _eq: false }, engineer_id: { _eq: $engineerId } }
    ) {
      badge_id
      id
    }
  }
`;

export const ISSUE_REQUEST_NOT_ANSWERED = gql`
  query issueRequestNotAnswered($engineerId: Int!) {
    issuing_requests(
      where: {
        badge_candidature_request: { engineer_id: { _eq: $engineerId } }
        is_approved: { _is_null: true }
      }
    ) {
      id
      badge_candidature_request {
        badge_id
      }
    }
  }
`;

//Acquired Badges

export const GET_REQUEST_ID = gql`
  query getRequestId {
    issuing_requests(where: { is_approved: { _eq: true } }) {
      request_id
    }
  }
`;

export const GET_ACQUIRED_BADGES = gql`
  query getWonBadges($engineerId: Int!, $id: [Int!]) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, id: { _in: $id } }
    ) {
      id
      badge_title
      candidature_evidences
      badge_description
      engineer_name
      engineer_id
    }
  }
`;

//Issuing Request

export const GET_CANDIDATURES = gql`
  query getBadgeCandidature($engineerId: Int!) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, is_issued: { _eq: false } }
    ) {
      id
      badge_id
      badge_title
      badge_description
      is_issued
    }
  }
`;

export const GET_REQUIREMENTS = gql`
  query getBadgeRequirements($id: Int!) {
    badge_candidature_view(where: { id: { _eq: $id } }) {
      badge_requirements
      id
      engineer_name
      badge_title
      badge_description
    }
  }
`;

//Requirements

export const GET_EVIDENCES = gql`
  query getEvidences($id: Int!) {
    badge_candidature_request(where: { id: { _eq: $id } }) {
      candidature_evidences
    }
  }
`;
