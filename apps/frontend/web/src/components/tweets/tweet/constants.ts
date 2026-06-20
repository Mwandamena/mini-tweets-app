import { TweetData } from "./types";

export const DUMMY_TWEET_DATA: TweetData = {
  id: "123456789",
  user: {
    name: "Diamond Media",
    handle: "@diamondtvzambia",
    avatarUrl: "https://picsum.photos/100/100",
    verified: false,
  },
  text: "ELECTION UPDATE:\n\nFDD/Tonse Chawama by-election candidate Bright Nundwe has been declared the winner of the Chawama by-election.",
  hashtag: "#NewsOnTheGo",
  timestamp: "3:36 AM · Jan 16, 2026",
  views: "19.8K",
  actions: {
    comments: 10,
    retweets: 61,
    likes: 232,
    saves: 9,
  },
};

export const REPLY_USER_AVATAR = "https://picsum.photos/90/90";
