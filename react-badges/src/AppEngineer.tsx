import React from "react";
import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
import Requirements from "./views/engineer/Requirements";
import Proposals from "./views/engineer/Proposals";
import Engineer from "./views/engineer/Engineer";

const AppEngineer: React.FC = () => (
  <AppEntrypoint
    icon={<EngineerIcon />}
    title="Engineer"
    defaultRoute="engineer"
    routes={[
      {
        path: "requirements",
        element: <Requirements/>
      },
      {
        path: "proposals",
        element: <Proposals/>
      },
      {
        path: "engineer",
        element: <Engineer />
      }
    ]}
  />
);

export default AppEngineer;