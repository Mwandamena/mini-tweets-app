import { Box } from "@mui/material";
import TweetCard from "../tweets/tweet.card";

function HomeForYou() {
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <TweetCard
        id="3526627220292"
        authorName="John Doe"
        content="Thanks to you 🤝 by Elon purchasing X a few things happened: - Unlocked free speech on the internet - all other social media platforms had to follow suit or loose viewership - News can be released immediately to millions uncensored from the scene vs going through MSM newsrooms- Fake news is held accountable by the people."
        createdAt="13h"
        authorImage="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        repostedBy="Elon Musk"
      />
      <TweetCard
        id="3526627220292"
        authorName="Jane Doe"
        content="Random Text here"
        createdAt="13h"
        authorImage="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        repostedBy="Elon Musk"
      />
      <TweetCard
        id="3526627220292"
        authorName="John Doe"
        content="My new profile picture on X - live"
        createdAt="13h"
        media={[
          "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
          "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
          "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
          "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
        ]}
        authorImage="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        repostedBy="Elon Musk"
      />
    </Box>
  );
}

export default HomeForYou;
