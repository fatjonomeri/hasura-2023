import React, { FC } from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";

interface TitleBarProps {
  title?: string;
  subtitle?: string;
}

const TitleBar: FC<TitleBarProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  if (!title && !subtitle) return;

  //console.log(theme.palette);

  return (
    <AppBar
      position={isMobile ? "sticky" : "static"}
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.getContrastText(theme.palette.background.default)
      }}
    >
      <Toolbar>
        <Stack>
          <Typography variant="h3">{title}</Typography>
          <Typography variant="caption">{subtitle}</Typography>
        </Stack>
      </Toolbar>
      <Divider />
    </AppBar>
  );
};

export default TitleBar;
