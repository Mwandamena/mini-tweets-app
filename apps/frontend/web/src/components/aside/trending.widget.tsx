"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { theme } from "@/theme/theme.material";
import AppMenu from "../global/menu";
import TrendingOptions from "./aside.options";

const TRENDS_DATA = [
  {
    context: "Politics · Trending",
    topic: "Charlie",
    posts: "295K posts",
  },
  {
    context: "Politics · Trending",
    topic: "Greenlanders",
    posts: "14.5K posts",
  },
  {
    context: "Trending in Zambia",
    topic: "Speed",
    posts: "160K posts",
  },
  {
    context: "Trending in Zambia",
    topic: "Africans",
    posts: "33.8K posts",
  },
];

interface TrendItemProps {
  context: string;
  topic: string;
  posts: string;
}

const TrendItem: React.FC<TrendItemProps> = ({ context, topic, posts }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        py: 1.5,
        px: 2,
        cursor: "pointer",
        "&:hover": {
          bgcolor: theme.palette.grey[50],
        },
      }}
    >
      <Box sx={{ flexGrow: 1, pr: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary, display: "block" }}
        >
          {context}
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ color: "text.primary", display: "block" }}
        >
          {topic}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary, display: "block" }}
        >
          {posts}
        </Typography>
      </Box>

      <AppMenu
        trigger={(open) => (
          <IconButton
            onClick={open}
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <MdOutlineMoreHoriz />
          </IconButton>
        )}
      >
        {(close) => <TrendingOptions />}
      </AppMenu>
    </Box>
  );
};

export default function TrendsWidget() {
  const widgetBgColor = theme.palette.background.paper;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: widgetBgColor,
        borderRadius: 1,
        overflow: "hidden",
        border: `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      {/* Widget Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "text.primary" }}
        >
          What's happening
        </Typography>
      </Box>

      {/* Trend Items */}
      <Box>
        {TRENDS_DATA.map((trend, index) => (
          <TrendItem key={index} {...trend} />
        ))}
      </Box>

      {/* Show More Link */}
      <Box sx={{ p: 2, "&:hover": { bgcolor: theme.palette.grey[50] } }}>
        <Link
          href="#"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Show more
        </Link>
      </Box>
    </Box>
  );
}
