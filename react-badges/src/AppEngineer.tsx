import React from "react";
import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
import Engineer from "./views/engineer/Engineer";

const AppEngineer: React.FC = () => (
  <AppEntrypoint
    icon={<EngineerIcon />}
    title="Engineer"
    defaultRoute="engineer"
    routes={[
      {
        path: "engineer",
        element: <Engineer />
      }
    ]}
  />
);

export default AppEngineer;
