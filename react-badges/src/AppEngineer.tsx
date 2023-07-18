// import React from "react";
// import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
// import Requirements from "./views/engineer/Requirements";
// import Proposals from "./views/engineer/Proposals";
// import Engineer from "./views/engineer/Engineer";
// import AcquiredBadges from "./views/engineer/AcquiredBadges";

// const AppEngineer: React.FC = () => (
//   <AppEntrypoint
//     icon={<EngineerIcon />}
//     title="Engineer"
//     defaultRoute="engineer"
//     routes={[
//       {
//         path: "requirements",
//         element: <Requirements />
//       },
//       {
//         path: "proposals",
//         element: <Proposals />
//       },
//       {
//         path: "engineer",
//         element: <Engineer />
//       },
//       {
//         path: "acquired-badges",
//         element: <AcquiredBadges />
//       }
//     ]}
//   />
// );

// export default AppEngineer;

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
import AcquiredBadges from "./views/engineer/AcquiredBadges";
import PendingProposals from "./views/engineer/PendingProposals";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

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
    link: "engineer/pending-proposals",
    text: "Pending Proposals",
    icon: <PendingActionsIcon />
  },
  {
    link: "engineer/requirements",
    text: "Add Required Evidences",
    icon: <ListAltIcon />
  },
  {
    link: "engineer/acquired-badges",
    text: "Your Badges",
    icon: <CheckIcon />
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
          path: "engineer/pending-proposals",
          element: <PendingProposals />
        },
        {
          path: "engineer/requirements",
          element: <Requirements />
        },
        {
          path: "engineer/acquired-badges",
          element: <AcquiredBadges />
        }
      ] as RouteProps[]
    }
  />
);

export default AppEngineer;
