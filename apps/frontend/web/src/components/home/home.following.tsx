import { Box } from "@mui/material";
import React from "react";
import TweetCard from "../tweets/tweet.card";

function HomeFollowing() {
  return (
    <Box sx={{ width: "100%" }}>
      <TweetCard
        id="1234546"
        authorName="Jane Doe"
        content="Random Text here"
        createdAt="13h"
        authorImage="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        repostedBy="Elon Musk"
      />
    </Box>
  );
}

export default HomeFollowing;
