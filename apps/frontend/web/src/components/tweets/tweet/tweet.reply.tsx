"use client";

import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { REPLY_USER_AVATAR } from "./constants";
import { FormControl, TextField } from "@mui/material";
import { theme } from "@/theme/theme.material";

const ReplyBox: React.FC = () => {
  return (
    <Box className="p-4 border-t border-b border-gray-100 flex items-center justify-between">
      <Box className="flex items-center space-x-3">
        <Avatar
          src={REPLY_USER_AVATAR}
          sx={{ width: 36, height: 36 }}
          className="shrink-0"
        />
        <Box component={"form"} className="flex-1">
          <FormControl>
            <TextField
              fullWidth
              multiline
              variant="standard"
              placeholder="Post a reply"
              rows={1}
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    color: theme.palette.text.primary,
                  },
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  paddingTop: 0,
                },
              }}
            />
          </FormControl>
        </Box>
      </Box>
      <Button
        variant="contained"
        size="small"
        className="bg-gray-700 text-white font-bold normal-case rounded-full px-4 py-1 hover:bg-gray-800 shadow-none"
        sx={{
          borderRadius: 9999,
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        }}
        onClick={() => console.log("Reply")}
      >
        Reply
      </Button>
    </Box>
  );
};

export default ReplyBox;
