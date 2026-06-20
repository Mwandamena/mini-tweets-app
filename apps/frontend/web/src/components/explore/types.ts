export interface NewsItem {
  id: number;
  title: string;
  timeAgo: string;
  category: string;
  posts: string;
  avatarUrls: string[];
}

export interface TrendingItem {
  id: number;
  category: string;
  title: string;
  trendingLocation?: string;
}
