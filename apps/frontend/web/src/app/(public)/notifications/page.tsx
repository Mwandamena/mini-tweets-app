"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from "@mui/icons-material/FlashOn";

type NotificationTab = "all" | "mentions";

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

  const TabButton: React.FC<{ label: string; tab: NotificationTab }> = ({
    label,
    tab,
  }) => (
    <Box
      onClick={() => setActiveTab(tab)}
      className={`flex-1 text-center py-3 cursor-pointer relative transition-colors duration-200 
        ${activeTab === tab ? "text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
    >
      <Typography variant="body1" className="text-base">
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
        <Typography variant="h6" component="h1" className="text-xl font-bold">
          Notifications
        </Typography>
        <IconButton size="medium" className="text-gray-900">
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box className="sticky top-[53px] z-10 flex border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <TabButton label="All" tab="all" />
        <TabButton label="Mentions" tab="mentions" />
      </Box>

      {/* Notifications List */}
      <Box className="flex-1 overflow-y-auto">
        {/* Notification Item 1 */}
        <Box className="p-4 border-b border-gray-100 flex items-start">
          <Box className="flex flex-col items-center mr-3 mt-1">
            <StarIcon
              sx={{ color: "#8b5cf6", fontSize: "1.5rem" }}
              className="mb-2"
            />{" "}
            {/* Sparkle icon */}
            <Avatar
              sx={{ width: 40, height: 40 }}
              className="bg-gray-400"
            />{" "}
            {/* User Avatar */}
          </Box>
          <Box className="flex-1 flex flex-col">
            <Box className="flex justify-between items-center mb-1">
              <Box className="flex items-center space-x-1">
                <Typography variant="body1" className="font-bold text-gray-900">
                  NIK
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  · 10h
                </Typography>
              </Box>
              <IconButton size="small" className="text-gray-500">
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box className="flex justify-between items-start">
              <Typography variant="body1" className="text-gray-900 pr-2">
                <span role="img" aria-label="breaking">
                  🚨
                </span>{" "}
                BREAKING: CLAUDE DOWN
              </Typography>
              <Box
                component="img"
                src="https://picsum.photos/100/70?random=1" // Placeholder for image preview
                alt="Claude Preview"
                className="w-24 h-16 rounded-lg ml-2 object-cover"
              />
            </Box>
          </Box>
        </Box>

        <Box className="p-4 border-b border-gray-100 flex items-start">
          <FlashOnIcon
            sx={{ color: "#1DA1F2", fontSize: "1.5rem" }}
            className="mr-3 mt-1"
          />
          <Box className="flex-1">
            <Typography variant="body1" className="text-gray-900 mb-1">
              <span className="font-bold">
                Breaking: Grok Imagine 1.0 launches
              </span>{" "}
              · Feb 5
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Make cinematic HD videos & animate your photos. Record-setting
              1.3B videos made.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationsPage;
