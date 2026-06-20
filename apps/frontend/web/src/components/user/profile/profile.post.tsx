"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RepeatIcon from "@mui/icons-material/Repeat";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IosShareIcon from "@mui/icons-material/IosShare";
import { PostItemData } from "../types";

interface ProfilePostItemProps {
  data: PostItemData;
}

const ProfilePostItem: React.FC<ProfilePostItemProps> = ({ data }) => {
  const { user } = data;

  return (
    <Box className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
      {data.type === "repost" && data.repostedBy && (
        <Box className="flex items-center space-x-2 ml-7 mb-1 text-gray-500">
          <RepeatIcon sx={{ fontSize: "1rem" }} />
          <Typography variant="caption" className="text-xs">
            {data.repostedBy} reposted
          </Typography>
        </Box>
      )}

      <Box className="flex space-x-3">
        <Avatar
          alt={user.name}
          src={user.avatarUrl}
          sx={{ width: 40, height: 40 }}
          className="shrink-0"
        />

        <Box className="flex-1">
          <Box className="flex justify-between items-center">
            <Box className="flex items-center space-x-1 text-sm">
              <Typography
                variant="body1"
                className="font-bold text-gray-900 hover:underline"
              >
                {user.name}
              </Typography>
              {user.verified && (
                <CheckCircleIcon
                  sx={{ fontSize: "0.9rem", color: "#1DA1F2" }}
                />
              )}
              <Typography variant="body2" className="text-gray-500">
                {user.handle}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                · {data.timeAgo}
              </Typography>
            </Box>
            <IconButton
              size="small"
              className="text-gray-500 hover:text-[#1DA1F2] hover:bg-blue-50"
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Tweet Text */}
          <Typography
            variant="body1"
            className="text-gray-900 mb-2 whitespace-pre-line"
          >
            {data.text}
          </Typography>

          {/* Simplified Action Bar */}
          <Box className="flex justify-between w-full max-w-sm">
            <IconButton
              size="small"
              className="text-gray-500 hover:text-[#1DA1F2] hover:bg-blue-50"
            >
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              className="text-gray-500 hover:text-[#17BF63] hover:bg-green-50"
            >
              <RepeatIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              className="text-gray-500 hover:text-[#E0245E] hover:bg-pink-50"
            >
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              className="text-gray-500 hover:text-[#1DA1F2] hover:bg-blue-50"
            >
              <IosShareIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePostItem;
