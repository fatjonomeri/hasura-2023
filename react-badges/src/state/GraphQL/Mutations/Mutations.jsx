import { gql } from "@apollo/client";

//Engineer and pending proposals
export const ADD_REQUEST = gql`
  mutation insertBadgeCandidature(
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

export const GET_PENDING_PROPOSALS = gql`
  mutation pendingFromEngineer($engineerId: Int!) {
    get_pending_proposals_for_engineer(args: { engineerid: $engineerId }) {
      badge_id
      badge_version
      id
      proposal_description
      badges_version {
        title
      }
    }
  }
`;

export const GET_PENDING_PROPOSALS_FOR_MANAGER = gql`
  mutation pendingFromManager($engineerId: Int!) {
    get_pending_proposals_for_manager(args: { engineerid: $engineerId }) {
      badge_id
      badge_version
      id
      badges_version {
        title
      }
    }
  }
`;

//Proposals

export const GET_PROPOSALS_CANDIDATURE = gql`
  mutation getProposalsFromManager($engineerId: Int!) {
    get_pending_proposals_for_manager(args: { engineerid: $engineerId }) {
      proposal_description
      badge_id
      id
      user {
        name
      }
      badges_version {
        title
        requirements
      }
    }
  }
`;

export const ACCEPT_PROPOSAL = gql`
  mutation acceptProposal(
    $proposal_id: Int!
    $created_by: Int!
    $disapproval_motivation: String!
    $is_approved: Boolean!
  ) {
    insert_engineer_badge_candidature_proposal_response(
      objects: {
        proposal_id: $proposal_id
        created_by: $created_by
        disapproval_motivation: $disapproval_motivation
        is_approved: $is_approved
      }
    ) {
      affected_rows
    }
  }
`;


//Requirements

export const APPEND_EVIDENCE = gql`
mutation appendEvidence($candidature_evidences: jsonb, $id: Int!) {
  update_badge_candidature_request(
    where: { id: { _eq: $id } }
    _append: { candidature_evidences: $candidature_evidences }
  ) {
    returning {
      candidature_evidences
    }
  }
}
`;

export const SET_EVIDENCE = gql`
  mutation SettingEvidence($candidature_evidences: jsonb, $id: Int!) {
    update_badge_candidature_request(
      where: { id: { _eq: $id } }
      _set: { candidature_evidences: $candidature_evidences }
    ) {
      returning {
        candidature_evidences
      }
    }
  }
`;

export const ISSUE_REQUEST = gql`
mutation issueRequest($id: Int!) {
  update_badge_candidature_request_by_pk(
    pk_columns: { id: $id }
    _set: { is_issued: true }
  ) {
    id
  }
}
`;