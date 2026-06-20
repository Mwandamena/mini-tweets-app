export interface BookmarkItem {
  id: number;
  avatarUrl: string;
  userName: string;
  userHandle: string;
  date: string;
  replyTo?: string;
  content: string[];
  commentCount: number;
  likeCount: number;
  analyticsCount: number;
}
