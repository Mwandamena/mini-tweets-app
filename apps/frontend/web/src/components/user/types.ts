export interface ProfileData {
  name: string;
  handle: string;
  postCount: string;
  location: string;
  bornDate: string;
  joinedDate: string;
  followingCount: string;
  followerCount: string;
  bannerUrl: string;
  avatarUrl: string;
  followedBy: {
    name: string;
    avatarUrl: string;
  } | null;
}

export interface PostItemData {
  id: string;
  type: "post" | "repost";
  user: {
    name: string;
    handle: string;
    avatarUrl: string;
    verified: boolean;
  };
  repostedBy?: string;
  text: string;
  timeAgo: string;
}
