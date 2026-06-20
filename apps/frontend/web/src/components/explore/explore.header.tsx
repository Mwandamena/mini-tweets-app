import React from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Header() {
  return (
    <Box className="flex items-center justify-between p-4 border-b border-gray-200">
      <Box className="relative flex items-center bg-gray-100 rounded-full py-2 px-4 flex-grow mr-4">
        <SearchIcon className="text-gray-500 mr-2" />
        <InputBase
          placeholder="Search"
          className="flex-grow text-gray-900"
          inputProps={{ "aria-label": "search" }}
        />
      </Box>
      <IconButton aria-label="settings" className="text-gray-500">
        <SettingsIcon />
      </IconButton>
    </Box>
  );
}
