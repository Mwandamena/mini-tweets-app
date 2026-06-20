"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import { mockFollowSuggestions } from "@/components/follow/constants";
import FollowItem from "@/components/follow/follow.item";

type FollowTab = "whoToFollow" | "creatorsForYou";

/**
 * Renders the X.com style "Follow" page.
 */
const FollowPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FollowTab>("whoToFollow");

  const TabButton: React.FC<{ label: string; tab: FollowTab }> = ({
    label,
    tab,
  }) => (
    <Box
      onClick={() => setActiveTab(tab)}
      className={`flex-1 text-center py-3 cursor-pointer relative transition-colors duration-200 
        ${activeTab === tab ? "text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
    >
      <Typography variant="body1" fontWeight={600} className="text-base">
        {label}
      </Typography>
      {activeTab === tab && (
        <Box className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-14 bg-[#1DA1F2] rounded-full" />
      )}
    </Box>
  );

  return (
    <Box className="relative flex flex-col h-full min-h-screen">
      {/* Header */}
      <Box className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <Box className="flex items-center">
          <IconButton size="medium" className="text-gray-900 mr-4">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="h1" className="text-xl font-bold">
            Follow
          </Typography>
        </Box>
        <IconButton size="medium" className="text-gray-900">
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box className="sticky top-[53px] z-10 flex border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <TabButton label="Who to follow" tab="whoToFollow" />
        <TabButton label="Creators for you" tab="creatorsForYou" />
      </Box>

      {/* Content based on active tab */}
      {activeTab === "whoToFollow" && (
        <Box className="flex-1 overflow-y-auto">
          <Typography
            variant="h4"
            className="font-bold text-xl px-4 py-3 border-b border-gray-100"
          >
            Suggested for you
          </Typography>
          {mockFollowSuggestions.map((user) => (
            <FollowItem key={user.handle} user={user} />
          ))}
        </Box>
      )}

      {activeTab === "creatorsForYou" && (
        <Box className="flex-1 overflow-y-auto p-4 text-center text-gray-500">
          <Typography variant="body1">
            No creators for you at the moment.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FollowPage;
