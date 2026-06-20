import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import { NewsItem } from "./types";

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <ListItemButton className="flex flex-col items-start p-4 hover:bg-gray-50">
      <Typography
        variant="body1"
        className="font-bold text-lg mb-2 dark:text-white"
      >
        {news.title}
      </Typography>
      <Box className="flex items-center w-full justify-between mb-2">
        <AvatarGroup max={3} className="mr-2">
          {news.avatarUrls.map((url, index) => (
            <Avatar
              key={index}
              alt={`Avatar ${index}`}
              src={url}
              className="w-2 h-2 border-2 border-white"
            />
          ))}
        </AvatarGroup>
        <Box className="flex-grow text-sm text-gray-500 flex items-center">
          <span>{news.timeAgo}</span>
          <span className="mx-1">•</span>
          <span>{news.category}</span>
          <span className="mx-1">•</span>
          <span>{news.posts}</span>
        </Box>
      </Box>
    </ListItemButton>
  );
}
