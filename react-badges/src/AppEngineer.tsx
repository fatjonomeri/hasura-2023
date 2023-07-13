import React from "react";
import AppEntrypoint, { EngineerIcon } from "./containers/AppEntrypoint";
import Requirements from "./views/engineer/Requirements";

const AppEngineer: React.FC = () => (
  <AppEntrypoint
    icon={<EngineerIcon />}
    title="Engineer"
    defaultRoute="engineer"
    routes={[
      {
        path: "requirements",
        element: <Requirements/>
      }
    ]}
  />
);

export default AppEngineer;
