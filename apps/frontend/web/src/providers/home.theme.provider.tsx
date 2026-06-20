"use client";

import { theme } from "@/theme/theme.material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

export const HomeThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
