export interface TweetData {
  id: string;
  user: {
    name: string;
    handle: string;
    avatarUrl: string;
    verified: boolean;
  };
  text: string;
  hashtag: string;
  timestamp: string;
  views: string;
  actions: {
    comments: number;
    retweets: number;
    likes: number;
    saves: number;
  };
}
