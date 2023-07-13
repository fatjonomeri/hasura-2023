import React from "react";
import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
import Proposals from "./views/engineer/Proposals";

const AppEngineer: React.FC = () => (
  <AppEntrypoint
    icon={<EngineerIcon />}
    title="Engineer"
    defaultRoute="engineer"
    routes={[
      {
        path: "proposals",
        element: <Proposals/>
      }
    ]}
  />
);

export default AppEngineer;