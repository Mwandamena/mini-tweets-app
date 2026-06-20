import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";

const XFooter = () => {
  const footerLinks = [
    "Terms of Service",
    "Privacy Policy",
    "Cookie Policy",
    "Accessibility",
    "Ads info",
    "More ...",
  ];

  return (
    <Box component="footer" sx={{ py: 2, px: 1 }}>
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        columnGap={1.5}
        rowGap={0.5}
      >
        {footerLinks.map((link, index) => (
          <React.Fragment key={link}>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "text.secondary",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              {link}
            </Link>
            {index < footerLinks.length - 1 && (
              <Typography
                sx={{ color: "text.secondary", fontSize: "13px", opacity: 0.5 }}
              >
                |
              </Typography>
            )}
          </React.Fragment>
        ))}

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "13px",
            ml: 1,
          }}
        >
          © 2026 X Corp.
        </Typography>
      </Stack>
    </Box>
  );
};

export default XFooter;
