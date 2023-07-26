import React, { useContext } from "react";
import { RouteProps } from "react-router-dom";
import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BadgeIcon from "@mui/icons-material/Badge";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { DrawerMenu } from "./layouts/BasicLayout";
import RuleIcon from "@mui/icons-material/Rule";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { users } from "./views/LoginView";
import { AuthContext } from "./state/with-auth";
import ProposalsContainer from "./containers/EngineerContainers/ProposalsContainer";
import AvailableBadgesContainer from "./containers/EngineerContainers/AvailableBadgesContainer";
import BadgesStatusContainer from "./containers/EngineerContainers/BadgesStatusContainer";
import AcquiredBadgesContainer from "./containers/EngineerContainers/AcquiredBadgesContainer";
import IssuingRequestContainer from "./containers/EngineerContainers/IssuingRequestContainer";
import RequirementsContainer from "./containers/EngineerContainers/RequirementsContainer";

const menuItems = [
  {
    link: "engineer/available-badges",
    text: "Available Badges",
    icon: <BadgeIcon />
  },
  {
    link: "engineer/candidatures",
    text: "Candidature",
    icon: <ContactMailIcon />
  },
  {
    link: "engineer/issuing-request",
    text: "Issue Request",
    icon: <ListAltIcon />
  },
  {
    link: "engineer/badges-status",
    text: "Badges Status",
    icon: <RuleIcon />
  },
  {
    link: "engineer/acquired-badges",
    text: "Your Badges",
    icon: <WorkspacePremiumIcon />
  }
];

const AppEngineer: React.FC = () => {
  const { user_id } = useContext(AuthContext);
  const engineer = users.find((user) => user.id === parseInt(user_id));
  console.log("engineer", engineer);
  return (
    <AppEntrypoint
      icon={<EngineerIcon />}
      title={`${engineer?.name} (Engineer)`}
      defaultRoute="engineer/available-badges"
      drawerContents={[
        <DrawerMenu title="Engineer Badges:" items={menuItems} />
      ]}
      mobileUtils={menuItems}
      routes={
        [
          {
            path: "engineer/available-badges",
            element: <AvailableBadgesContainer />
          },
          {
            path: "engineer/candidatures",
            element: <ProposalsContainer />
          },
          {
            path: "engineer/issuing-request",
            element: <IssuingRequestContainer />
          },
          {
            path: "engineer/acquired-badges",
            element: <AcquiredBadgesContainer />
          },
          {
            path: "engineer/issuing-request/requirements/:requestID",
            element: <RequirementsContainer />
          },
          {
            path: "engineer/badges-status",
            element: <BadgesStatusContainer />
          }
        ] as RouteProps[]
      }
    />
  );
};

export default AppEngineer;
