"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import { FollowSuggestion } from "./constants";

interface FollowItemProps {
  user: FollowSuggestion;
}

const FollowItem: React.FC<FollowItemProps> = ({ user }) => {
  return (
    <Box className="flex items-start p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <Avatar
        src={user.avatarUrl}
        alt={user.name}
        sx={{ width: 48, height: 48 }}
        className="mr-3 shrink-0"
      />
      <Box className="flex-1 min-w-0">
        {user.followedBy && (
          <Box className="flex items-center text-gray-500 mb-1">
            <PersonIcon sx={{ fontSize: "0.9rem", mr: 0.5 }} />
            <Typography component={"p"} variant="body2" className="text-xs">
              {user.followedBy} follows
            </Typography>
          </Box>
        )}
        <Box className="flex items-center mb-1">
          <Typography
            variant="body1"
            component={"p"}
            className="font-bold text-gray-900 truncate"
          >
            {user.name}
          </Typography>
          {user.verified && (
            <CheckCircleIcon
              sx={{ fontSize: "0.9rem", color: "#1DA1F2", ml: 0.5 }}
            />
          )}
        </Box>
        <Typography variant="body2" className="text-gray-500 mb-2 truncate">
          {user.handle}
        </Typography>
        <Typography
          variant="body2"
          className="text-gray-900 leading-snug break-words"
        >
          {user.bio.split(" ").map((word, index) => {
            if (
              word.startsWith("@") ||
              word.startsWith("http://") ||
              word.startsWith("https://") ||
              word.startsWith("cal.com")
            ) {
              return (
                <a
                  key={index}
                  href={word.startsWith("http") ? word : `https://${word}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DA1F2] hover:underline"
                >
                  {word}{" "}
                </a>
              );
            }
            return <span key={index}>{word} </span>;
          })}
        </Typography>
      </Box>
      <Button
        size="small"
        variant="contained"
        onClick={() => console.log(`Followed ${user.name}`)}
      >
        Follow
      </Button>
    </Box>
  );
};

export default FollowItem;
