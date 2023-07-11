import React from "react";
import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
import Engineer from "./views/engineer/Engineer";

const AppEngineer: React.FC = () => (
  <AppEntrypoint
    icon={<EngineerIcon />}
    title="Engineer"
    defaultRoute="dashboard"
    routes={[
      {
        path: "dashboard",
        element: <Engineer />
      }
    ]}
  />
);

export default AppEngineer;
