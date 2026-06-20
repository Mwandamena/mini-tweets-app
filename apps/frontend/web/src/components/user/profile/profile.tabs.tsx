"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useUIStore } from "@/store/ui.store";

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabProps> = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    className={`flex-1 text-center py-3 cursor-pointer relative transition-colors duration-200 
      ${active ? "text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
  >
    <Typography variant="body1" className="text-base">
      {label}
    </Typography>
    {active && (
      <Box className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-14 bg-[#1DA1F2] rounded-full" />
    )}
  </Box>
);

const ProfileTabs: React.FC = () => {
  const { profileTab, setProfileTab } = useUIStore();

  return (
    <Box className="sticky top-[53px] z-10 flex border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <TabButton
        label="Posts"
        active={profileTab === "posts"}
        onClick={() => setProfileTab("posts")}
      />
      <TabButton
        label="Replies"
        active={profileTab === "replies"}
        onClick={() => setProfileTab("replies")}
      />
      <TabButton
        label="Media"
        active={profileTab === "media"}
        onClick={() => setProfileTab("media")}
      />
    </Box>
  );
};

export default ProfileTabs;
