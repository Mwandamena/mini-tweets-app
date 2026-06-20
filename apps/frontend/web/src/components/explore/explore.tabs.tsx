import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabsNavigationProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function TabsNavigation({
  activeTab,
  setActiveTab,
}: TabsNavigationProps) {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="w-full">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="news feed tabs"
        variant="fullWidth"
      >
        <Tab label="For You" />
        <Tab label="Trending" />
        <Tab label="News" />
        <Tab label="Sports" />
        <Tab label="Entertainment" />
      </Tabs>
    </Box>
  );
}
