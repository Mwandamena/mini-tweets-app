import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListItemButton from "@mui/material/ListItemButton";
import { TrendingItem } from "./types";

interface TrendingCardProps {
  trending: TrendingItem;
}

export default function TrendingCard({ trending }: TrendingCardProps) {
  return (
    <ListItemButton className="flex flex-col items-start p-4 hover:bg-gray-50">
      <Box className="flex items-center justify-between w-full">
        <Box className="flex-grow">
          <Typography variant="caption" className="text-gray-500">
            {trending.category}{" "}
            {trending.trendingLocation && `• ${trending.trendingLocation}`}
          </Typography>
          <Typography variant="body1" className="font-bold">
            {trending.title}
          </Typography>
        </Box>
        <IconButton aria-label="more options" className="text-gray-500">
          <MoreHorizIcon />
        </IconButton>
      </Box>
    </ListItemButton>
  );
}
