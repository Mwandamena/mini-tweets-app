import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from "@mui/icons-material/Tune";
import TweetContent from "@/components/tweets/tweet/tweet.content";
import { DUMMY_TWEET_DATA } from "@/components/tweets/tweet/constants";
import TweetActions from "@/components/tweets/tweet.actions";
import ReplyBox from "@/components/tweets/tweet/tweet.reply";
import TweetComments from "@/components/tweets/tweet/tweet.comments";

export default function page() {
  return (
    <React.Fragment>
      <Box sx={{ width: "100%", position: "relative" }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "#ffff",
            backdropFilter: "blur(12px)",
            backgroundOpacity: 0.6,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            justifyContent={"space-between"}
            p={1}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <IconButton
                sx={{
                  bgcolor: "transparent",
                  "&:hover": { bgcolor: "transparent" },
                }}
              >
                <ArrowBackIcon
                  fontSize="small"
                  sx={{ color: "text.primary" }}
                />
              </IconButton>
              <Typography variant="h4">Post</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={0.5}>
              <Button variant="outlined" size="small">
                Reply
              </Button>
              <IconButton size="small" sx={{ p: 0.6 }}>
                <TuneIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </AppBar>

        <TweetContent data={DUMMY_TWEET_DATA} />

        {/* tweet actions */}
        <TweetActions />

        {/* tweet reply */}
        <ReplyBox />

        {/* tweet comments */}
        <TweetComments />
      </Box>
    </React.Fragment>
  );
}
