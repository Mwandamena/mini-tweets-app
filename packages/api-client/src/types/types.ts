export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

// User types
export interface Following {
  id: string;
  followerId: string;
  followingId: string;
  status: string;
}
export interface Followers {
  id: string;
  followerId: string;
  followingId: string;
  status: string;
}
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  following: Following[];
  followers: Followers[];
}

export interface UpdateUserRequest {
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface Tweet {
  id: string;
  content: string;
  authorId: string;
  author: User;
  likes: number;
  isLiked: boolean;
  retweets: number;
  replies: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTweetRequest {
  content: string;
}

export interface UpdateTweetRequest {
  content: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  profileImage?: string;
  verified: boolean;
  bio?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
  verified: boolean;
  following: Following[];
  followers: Followers[];
}

// Tweet types
export interface Tweet {
  id: string;
  content: string;
  authorId: string;
  media: string[];
  viewCount: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberCount: number;
}

export interface EmailRequest {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface ServiceResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
