import { Box } from "@mui/material";
import React from "react";
import TweetCard from "../tweet.card";

function TweetComments() {
  return (
    <Box sx={{ width: "100%" }}>
      <TweetCard
        id="1234546"
        authorName="Jane Doe"
        content="Random comment here"
        createdAt="13h"
        authorImage="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        repostedBy="Elon Musk"
      />
      <TweetCard
        id="1234546"
        authorName="Jane Doe"
        content="This is the best comment ever!"
        createdAt="13h"
        authorImage="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        repostedBy="Elon Musk"
      />
      <TweetCard
        id="1234546"
        authorName="Jane Doe"
        content="Some way to compensate you."
        createdAt="13h"
        authorImage="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        repostedBy="Elon Musk"
      />
    </Box>
  );
}

export default TweetComments;
