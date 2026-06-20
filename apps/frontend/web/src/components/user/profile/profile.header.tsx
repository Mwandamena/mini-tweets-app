"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import { ProfileData } from "../types";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  data: ProfileData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ data }) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <Box className="sticky top-0 z-20 flex items-center justify-between px-2 py-2 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <Box className="flex items-center space-x-4">
        <IconButton size="small" className="text-gray-900" onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box className="flex flex-col">
          <Typography
            variant="h6"
            component="h1"
            className="text-xl font-bold leading-none"
          >
            {data.name}
          </Typography>
          <Typography
            variant="caption"
            className="text-sm text-gray-500 leading-none"
          >
            {data.postCount} posts
          </Typography>
        </Box>
      </Box>
      <Box className="flex items-center space-x-1">
        <IconButton size="small" className="text-gray-900">
          <SearchIcon />
        </IconButton>
        <IconButton size="small" className="text-gray-900">
          <NotificationsNoneIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
