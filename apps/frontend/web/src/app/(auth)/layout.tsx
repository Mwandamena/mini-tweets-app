import React from "react";
import "../globals.css";
import { AuthThemeProvider } from "@/providers/auth.theme.provider";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthThemeProvider>{children}</AuthThemeProvider>;
}
