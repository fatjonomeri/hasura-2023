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
import BadgesStatusView from "../../views/engineer/BadgesStatusView";

const BadgesStatusContainer = () => {
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
    <BadgesStatusView
    currentTab={currentTab}
    handleTabChange={handleTabChange}
    approvedProposals={approvedProposals}
    applicationsFromEngineer={applicationsFromEngineer}
  />
  );
};

export default BadgesStatusContainer;