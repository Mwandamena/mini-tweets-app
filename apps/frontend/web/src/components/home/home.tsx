"use client";

import { Box, Tab, Tabs } from "@mui/material";
import HomePost from "./home-post";
import HomeStories from "./home.stories";
import HomeForYou from "./home.fy";
import HomeFollowing from "./home.following";
import HomeCommunities from "./home.communities";
import { useUIStore } from "@/store/ui.store";
import HomeTabs from "./home.tab";

const TopBar = () => {
  // ui state
  const { activeTab, setActiveTab } = useUIStore();

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: "forYou" | "following" | "communities",
  ) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "50px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper ",
        backdropFilter: "blur(12px)",
        backgroundOpacity: 0.6,
      }}
    >
      <Box>
        <HomeTabs />
      </Box>
    </Box>
  );
};

function Home() {
  // ui state
  const { activeTab } = useUIStore();
  return (
    <Box
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        overflowY: "auto",
        position: "relative",
        height: "100vh",
      }}
    >
      <TopBar />

      {/* home stories */}
      {activeTab === "forYou" && <HomeStories />}

      {/* home post */}
      <HomePost />

      {/* home fy tweets */}
      {activeTab === "forYou" && <HomeForYou />}

      {/* home following */}
      {activeTab === "following" && <HomeFollowing />}

      {/* home communities */}
      {activeTab === "communities" && <HomeCommunities />}
    </Box>
  );
}

export default Home;
