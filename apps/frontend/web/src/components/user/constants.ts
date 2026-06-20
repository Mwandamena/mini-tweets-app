import { ProfileData, PostItemData } from "./types";

export const MOCK_PROFILE_DATA: ProfileData = {
  name: "Zonke",
  handle: "@MalonyNkesberg",
  postCount: "21.5K",
  location: "Lusaka, Zambia",
  bornDate: "August 14",
  joinedDate: "May 2013",
  followingCount: "1,133",
  followerCount: "1,138",
  // Placeholders for images
  bannerUrl: "https://picsum.photos/600/200?random=1",
  avatarUrl: "https://picsum.photos/180/180?random=2",
  followedBy: {
    name: "B'Flow",
    avatarUrl: "https://picsum.photos/40/40?random=3",
  },
};

export const MOCK_POST_ITEM: PostItemData = {
  id: "post-1",
  type: "repost",
  repostedBy: "Zonke",
  user: {
    name: "Janty",
    handle: "@CFC_Janty",
    avatarUrl: "https://picsum.photos/40/40?random=4",
    verified: true,
  },
  text: "Ferran Torres is the best shit player ever seen in my life. What a player",
  timeAgo: "13h",
};
