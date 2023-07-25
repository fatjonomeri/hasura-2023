import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  ACCEPTED_DECLINED_PROPOSALS,
  ACCEPTED_DECLINED_PROPOSALS_FROM_MANAGER
} from "../../state/GraphQL/Queries/Queries";
import { Typography, Box, Paper, Tab, Tabs } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import EngineerApplicationsTable from "../../components/ComponentsEngineer/EngineerApplicationsTable ";
import ManagerProposalsTable from "../../components/ComponentsEngineer/ManagerProposalsTable ";
import CenteredLayout from "../../layouts/CenteredLayout";
import LoadableCurtain from "../../components/LoadableCurtain";

const BadgesStatus = () => {
  const { user_id } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState(0);

  const {
    loading: approvedLoading,
    error: approvedError,
    data: approvedData,
    refetch: refetchApprovedData
  } = useQuery(ACCEPTED_DECLINED_PROPOSALS, {
    variables: {
      engineerId: user_id
    }
  });

  const {
    loading: applicationsLoading,
    error: applicationsError,
    data: applicationsData,
    refetch: refetchApplicationData
  } = useQuery(ACCEPTED_DECLINED_PROPOSALS_FROM_MANAGER, {
    variables: {
      engineerId: user_id
    }
  });

  useEffect(() => {
    refetchApplicationData();
    refetchApprovedData();
  }, []);

  if (approvedLoading || applicationsLoading) {
    return (
      <CenteredLayout>
        <LoadableCurtain text="Badge Status" />
      </CenteredLayout>
    );
  }

  if (approvedError) {
    return <div>Error: {approvedError.message}</div>;
  }

  if (applicationsError) {
    return <div>Error: {applicationsError.message}</div>;
  }

  const approvedProposals =
    approvedData.manager_to_engineer_badge_candidature_proposals;

  const applicationsFromEngineer =
    applicationsData.engineer_to_manager_badge_candidature_proposals;

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <BasicPage fullpage title="Badges Status">
      <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
        Here is the status of your candidature proposals for badges:
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Paper sx={{ width: "100%", marginBottom: 2 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Proposals From Manager" />
            <Tab label="Applications from Engineer" />
          </Tabs>
        </Paper>
        {currentTab === 0 && approvedProposals.length > 0 && (
          <ManagerProposalsTable proposals={approvedProposals} />
        )}
        {currentTab === 1 && applicationsFromEngineer.length > 0 && (
          <EngineerApplicationsTable applications={applicationsFromEngineer} />
        )}
        {currentTab === 0 && approvedProposals.length === 0 && (
          <Typography>No data available for Proposals From Manager</Typography>
        )}
        {currentTab === 1 && applicationsFromEngineer.length === 0 && (
          <Typography>
            No data available for Applications from Engineer
          </Typography>
        )}
      </Box>
    </BasicPage>
  );
};

export default BadgesStatus;