import { NewsItem, TrendingItem } from "@/components/explore/types";

export const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    title: "Iran Hits Ships in Strait of Hormuz Amid U.S. Air Campaign",
    timeAgo: "2 days ago",
    category: "Other",
    posts: "240K posts",
    avatarUrls: [
      "https://picsum.photos/40/40?random=1",
      "https://picsum.photos/40/40?random=2",
      "https://picsum.photos/40/40?random=3",
    ],
  },
  {
    id: 2,
    title: "Trump Warns Iran of Crushing Retaliation Over Strait of Hormuz",
    timeAgo: "2 days ago",
    category: "News",
    posts: "911K posts",
    avatarUrls: [
      "https://picsum.photos/40/40?random=4",
      "https://picsum.photos/40/40?random=5",
      "https://picsum.photos/40/40?random=6",
    ],
  },
  {
    id: 3,
    title: "Senator Murphy Criticizes Trump's Iran War Plans as Incoherent",
    timeAgo: "14 hours ago",
    category: "News",
    posts: "222K posts",
    avatarUrls: [
      "https://picsum.photos/40/40?random=7",
      "https://picsum.photos/40/40?random=8",
      "https://picsum.photos/40/40?random=9",
    ],
  },
];

export const TRENDING_DATA: TrendingItem[] = [
  {
    id: 1,
    category: "Business & finance",
    title: "Zambia",
  },
  {
    id: 2,
    category: "Technology",
    title: "Cloudflare",
  },
  {
    id: 3,
    category: "Trending in Zambia",
    title: "Ndola",
  },
  {
    id: 4,
    category: "Trending in Zambia",
    title: "upnd",
  },
];
