import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { TweetData } from "./types";
import { Stack } from "@mui/material";

interface TweetContentProps {
  data: TweetData;
}

const TweetContent: React.FC<TweetContentProps> = ({ data }) => {
  const [header, body] = data.text.split("\n\n");

  return (
    <Box className="pt-4 px-4">
      <Box className="flex justify-between items-start mb-3">
        <Stack direction={"row"} alignItems={"start"} spacing={1}>
          <Avatar
            alt={data.user.name}
            src={data.user.avatarUrl}
            sx={{ width: 48, height: 48 }}
          />
          <Stack direction={"column"} alignItems={"start"} spacing={-0.1}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color={"text.primary"}
            >
              {data.user.name}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              color={"text.secondary"}
            >
              {data.user.handle}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Tweet Body */}
      <Box className="mb-4">
        <Typography
          variant="body1"
          component="p"
          className="mb-2 whitespace-pre-line"
        >
          <Typography component={"span"} variant="body1" fontWeight={600}>
            {header}
          </Typography>
        </Typography>
        <Typography
          variant="body1"
          component="p"
          className="mb-2 whitespace-pre-line"
        >
          {body}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          fontWeight={600}
          color="#1DA1F2"
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {data.hashtag}
        </Typography>
      </Box>

      {/* Metadata */}
      <Box className="py-3 border-y border-gray-100 mb-2">
        <Typography
          variant="caption"
          component="div"
          className="text-gray-500 text-base"
        >
          {data.timestamp}
          <span className="mx-2 text-gray-400">·</span>
          <span className="font-extrabold text-gray-900">{data.views}</span>
          <span className="ml-1">Views</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default TweetContent;
