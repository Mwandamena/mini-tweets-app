import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  auth: {
    currentUser: ["auth", "current-user"] as const,
  },
  tweets: {
    all: ["tweets"] as const,
    list: (filters?: any) => ["tweets", "list", filters] as const,
    detail: (id: string) => ["tweets", "detail", id] as const,
    byUser: (userId: string) => ["tweets", "by-user", userId] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    profile: (username: string) => ["users", "profile", username] as const,
  },
} as const;
