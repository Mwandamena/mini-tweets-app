import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";

export default function BookmarkHeader() {
  return (
    <Box className="flex flex-col p-4 border-b border-gray-200">
      <Box className="flex items-center mb-4">
        <IconButton
          aria-label="back"
          className="text-gray-900 -ml-2 mr-2"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" className="font-bold">
          Bookmarks
        </Typography>
      </Box>
      <Box className="relative flex items-center bg-gray-100 rounded-full py-2 px-4 flex-grow">
        <SearchIcon className="text-gray-500 mr-2" />
        <InputBase
          placeholder="Search Bookmarks"
          className="flex-grow text-gray-900"
          inputProps={{ "aria-label": "search bookmarks" }}
        />
      </Box>
    </Box>
  );
}
