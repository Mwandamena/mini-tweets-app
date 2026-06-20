import React from "react";
import { Box, Link, Typography, Stack } from "@mui/material";

const footerLinks = [
  ["About", "https://about.twitter.com"],
  ["Help Center", "https://help.twitter.com"],
  ["Privacy Policy", "https://twitter.com/tos"],
  ["Cookie Policy", "https://support.twitter.com/articles/20170514"],
  ["Accessibility", "https://help.twitter.com/resources/accessibility"],
  [
    "Ads Info",
    "https://business.twitter.com/en/help/troubleshooting/how-twitter-ads-work.html",
  ],
  ["Blog", "https://blog.twitter.com"],
  ["Status", "https://status.twitterstat.us"],
  ["Careers", "https://careers.twitter.com"],
  ["Brand Resources", "https://about.twitter.com/press/brand-assets"],
  ["Advertising", "https://ads.twitter.com/?ref=gl-tw-tw-twitter-advertise"],
  ["Marketing", "https://marketing.twitter.com"],
  ["Twitter for Business", "https://business.twitter.com"],
  ["Developers", "https://developer.twitter.com"],
  ["Directory", "https://twitter.com/i/directory/profiles"],
  ["Settings", "https://twitter.com/settings"],
] as const;

export function LoginFooterMui() {
  return (
    <Box
      component="footer"
      sx={{
        display: { xs: "none", lg: "flex" },
        justifyContent: "center",
        p: 2,
        mt: 2,
        color: "text.secondary",
      }}
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        rowGap={1}
        columnGap={2}
        component="nav"
      >
        {footerLinks.map(([linkName, href]) => (
          <Link
            key={linkName}
            href={href}
            target="_blank"
            rel="noreferrer"
            variant="caption"
            underline="hover"
            color="inherit"
            sx={{
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {linkName}
          </Link>
        ))}
        <Typography
          variant="caption"
          color="inherit"
          sx={{ whiteSpace: "nowrap" }}
        >
          © {new Date().getFullYear().toString()} Twitter, Inc.
        </Typography>
      </Stack>
    </Box>
  );
}
