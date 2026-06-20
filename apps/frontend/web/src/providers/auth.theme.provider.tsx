"use client";

import { theme } from "@/theme/theme.material";
import { Box, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";

export const AuthThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Box component={"main"}>{children}</Box>;
};
