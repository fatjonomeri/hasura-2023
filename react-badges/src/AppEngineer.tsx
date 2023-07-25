import React, { useContext } from "react";
import { RouteProps } from "react-router-dom";
import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckIcon from "@mui/icons-material/Check";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Requirements from "./views/engineer/Requirements";
import Proposals from "./views/engineer/Proposals";
import Engineer from "./views/engineer/AvailableBadges";
import { DrawerMenu } from "./layouts/BasicLayout";
import AcquiredBadges from "./views/engineer/AcquiredBadges";
import IssuingRequest from "./views/engineer/IssuingRequest";
import RuleIcon from "@mui/icons-material/Rule";
import BadgesStatus from "./views/engineer/BadgesStatus";
import { users } from "./views/LoginView";
import { AuthContext } from "./state/with-auth";
import AvailableBadges from "./views/engineer/AvailableBadges";

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
    icon: <CheckIcon />
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
            element: <AvailableBadges />
          },
          {
            path: "engineer/candidatures",
            element: <Proposals />
          },
          {
            path: "engineer/issuing-request",
            element: <IssuingRequest />
          },
          {
            path: "engineer/acquired-badges",
            element: <AcquiredBadges />
          },
          {
            path: "engineer/issuing-request/requirements/:requestID",
            element: <Requirements />
          },
          {
            path: "engineer/badges-status",
            element: <BadgesStatus />
          }
        ] as RouteProps[]
      }
    />
  );
};

export default AppEngineer;
