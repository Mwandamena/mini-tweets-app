import { Box } from "@mui/material";
import TweetCard from "../tweets/tweet.card";

function HomeCommunities() {
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <TweetCard
        authorName="Jane Doe"
        content="Random Text here"
        createdAt="13h"
        authorImage="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        repostedBy="Elon Musk"
      />
    </Box>
  );
}

export default HomeCommunities;
