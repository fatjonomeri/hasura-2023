import React from "react";
import { Skeleton } from "@mui/material";

const EvidenceSkeleton = ({ message }) => {
  return (
    <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
  );
};

export default EvidenceSkeleton;
