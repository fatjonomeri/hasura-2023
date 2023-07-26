// ManagerProposalsTable.js
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

const ManagerProposalsTable = ({ proposals }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Badge Title</TableCell>
            <TableCell>Badge Status</TableCell>
            <TableCell>Manager Name</TableCell>
            <TableCell>Disapproval Motivation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proposals.map((proposal) => (
            <TableRow key={proposal.badges_version.id}>
              <TableCell>{proposal.badges_version?.title}</TableCell>
              <TableCell>
                {proposal.engineer_badge_candidature_proposal_responses[0]
                  ?.is_approved
                  ? "Accepted"
                  : proposal.engineer_badge_candidature_proposal_responses[0]
                      ?.is_approved === false
                  ? "Rejected"
                  : "Pending"}
              </TableCell>
              <TableCell>{proposal.user?.name || "-"}</TableCell>
              <TableCell>
                {proposal.engineer_badge_candidature_proposal_responses[0]
                  ?.disapproval_motivation || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManagerProposalsTable;
