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
    <Typography variant="body1" fontWeight={500} className="text-base">
      {label}
    </Typography>
    {active && (
      <Box className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-14 bg-[#1DA1F2] rounded-full" />
    )}
  </Box>
);

const HomeTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <Box
      sx={{ display: "flex", width: "100%", maxHeight: "100%", height: "50px" }}
    >
      <TabButton
        label="For you"
        active={activeTab === "forYou"}
        onClick={() => setActiveTab("forYou")}
      />
      <TabButton
        label="Following"
        active={activeTab === "following"}
        onClick={() => setActiveTab("following")}
      />
      <TabButton
        label="Communities"
        active={activeTab === "communities"}
        onClick={() => setActiveTab("communities")}
      />
    </Box>
  );
};

export default HomeTabs;
