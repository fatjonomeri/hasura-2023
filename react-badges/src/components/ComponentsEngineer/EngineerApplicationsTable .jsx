// EngineerApplicationsTable.js
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const EngineerApplicationsTable = ({ applications }) => {
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
          {applications.map((application) => (
            <TableRow key={application.badges_version.id}>
              <TableCell>{application.badges_version.title}</TableCell>
              <TableCell>
                {application.manager_badge_candidature_proposal_responses[0]?.is_approved
                  ? "Accepted"
                  : application.manager_badge_candidature_proposal_responses[0]?.is_approved === false
                  ? "Rejected"
                  : "Pending"}
              </TableCell>
              <TableCell>{application.userByManager?.name || "-"}</TableCell>
              <TableCell>
                {application.manager_badge_candidature_proposal_responses[0]?.disapproval_motivation || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EngineerApplicationsTable;