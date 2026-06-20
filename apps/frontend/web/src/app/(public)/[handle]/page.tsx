"use client";

import { MOCK_PROFILE_DATA } from "@/components/user/constants";
import ProfileHeader from "@/components/user/profile/profile.header";
import ProfileInfo from "@/components/user/profile/profile.info";
import ProfileMedia from "@/components/user/profile/profile.media";
import ProfilePosts from "@/components/user/profile/profile.posts";
import ProfileReplies from "@/components/user/profile/profile.replies";
import ProfileTabs from "@/components/user/profile/profile.tabs";
import EditProfileModal from "@/components/user/profile/profile.update";
import { useUIStore } from "@/store/ui.store";
import { Box } from "@mui/material";
import React from "react";

const RenderTab = () => {
  const { profileTab } = useUIStore();
  return (
    <React.Fragment>
      {profileTab === "posts" && <ProfilePosts />}
      {profileTab === "replies" && <ProfileReplies />}
      {profileTab === "media" && <ProfileMedia />}
    </React.Fragment>
  );
};

function Page() {
  return (
    <Box className="min-h-screen bg-gray-50 flex justify-center">
      {/* Centered container to simulate the X.com feed column */}
      <Box className="w-full bg-white shadow-xl border-x border-gray-200">
        {/* Sticky Header */}
        <ProfileHeader data={MOCK_PROFILE_DATA} />

        {/* Main Profile Content */}
        <Box className="flex flex-col">
          <ProfileInfo data={MOCK_PROFILE_DATA} />
          <ProfileTabs />

          {/* profile content */}
          <RenderTab />
        </Box>
      </Box>

      {/* update profile modal */}
      <EditProfileModal />
    </Box>
  );
}

export default Page;
