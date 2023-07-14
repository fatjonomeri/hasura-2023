import React from "react";
import { RouteProps } from "react-router-dom";
import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckIcon from "@mui/icons-material/Check";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Requirements from "./views/engineer/Requirements";
import Proposals from "./views/engineer/Proposals";
import Engineer from "./views/engineer/Engineer";
import { DrawerMenu } from "./layouts/BasicLayout";

const menuItems = [
  {
    link: "engineer/available-badges",
    text: "Available Badges",
    icon: <BadgeIcon />
  },
  {
    link: "engineer/proposals",
    text: "Candidature Proposals",
    icon: <ContactMailIcon />
  },
  {
    link: "engineer/requirements",
    text: "Add Required Evidences",
    icon: <ListAltIcon />
  }
];

const AppEngineer: React.FC = () => (
  <AppEntrypoint
    icon={<EngineerIcon />}
    title={"Engineer"}
    defaultRoute="engineer/available-badges"
    drawerContents={[<DrawerMenu title="Engineer Badges:" items={menuItems} />]}
    mobileUtils={menuItems}
    routes={
      [
        {
          path: "engineer/available-badges",
          element: <Engineer />
        },
        {
          path: "engineer/proposals",
          element: <Proposals />
        },
        {
          path: "engineer/requirements",
          element: <Requirements />
        }
      ] as RouteProps[]
    }
  />
);

export default AppEngineer;
