"use client";

import PostModal from "@/components/post/post.modal";
import Aside from "@/components/sidebar/aside";
import Sidebar from "@/components/sidebar/sidebar";
import { HomeThemeProvider } from "@/providers/home.theme.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import React from "react";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <HomeThemeProvider>
        <ThemeProvider>
          {/* post modal */}
          <PostModal />
          <Box
            component="main"
            sx={{
              display: "flex",
              width: "100%",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <Box
              component="nav"
              sx={{
                flexShrink: 0,
                minWidth: { xs: "60px", md: "250px", lg: "300px" },
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Sidebar />
            </Box>
            <Box
              component="main"
              sx={{
                minWidth: { xs: "100%", md: "250px", lg: "400px" },
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              {children}
            </Box>
            <Box
              component="aside"
              sx={{
                overflowY: "auto",
                minWidth: { xs: "60px", md: "250px", lg: "400px" },
                display: { xs: "none", md: "block" },
              }}
            >
              <Aside />
            </Box>
          </Box>
        </ThemeProvider>
      </HomeThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default LayoutProvider;
