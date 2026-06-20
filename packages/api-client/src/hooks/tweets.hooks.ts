import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiClient } from "../clients/api.client";
import { queryKeys } from "../clients/query.client";
import {
  Tweet,
  CreateTweetRequest,
  UpdateTweetRequest,
  PaginatedResponse,
  ApiResponse,
} from "../types/types";

// Tweets API functions
export const tweetsApi = {
  getAll: (page = 1, pageSize = 20) =>
    apiClient.get<ApiResponse<PaginatedResponse<Tweet>>>("/tweets", {
      page,
      pageSize,
    }),

  getById: (id: string) => apiClient.get<ApiResponse<Tweet>>(`/tweets/${id}`),

  getByUser: (userId: string, page = 1) =>
    apiClient.get<ApiResponse<PaginatedResponse<Tweet>>>(
      `/tweets/user/${userId}`,
      { page }
    ),

  create: (data: CreateTweetRequest) =>
    apiClient.post<ApiResponse<Tweet>>("/tweets", data),

  update: (id: string, data: UpdateTweetRequest) =>
    apiClient.put<ApiResponse<Tweet>>(`/tweets/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/tweets/${id}`),

  like: (id: string) =>
    apiClient.post<ApiResponse<Tweet>>(`/tweets/${id}/like`),

  unlike: (id: string) =>
    apiClient.delete<ApiResponse<Tweet>>(`/tweets/${id}/like`),
};

// React Query hooks
export const useTweets = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: queryKeys.tweets.list({ page, pageSize }),
    queryFn: async () => {
      const response = await tweetsApi.getAll(page, pageSize);
      return response.data;
    },
  });
};

// Infinite scroll hook
export const useInfiniteTweets = (pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: queryKeys.tweets.list({ pageSize }),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tweetsApi.getAll(pageParam, pageSize);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};

export const useTweet = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tweets.detail(id),
    queryFn: async () => {
      const response = await tweetsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUserTweets = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.tweets.byUser(userId),
    queryFn: async () => {
      const response = await tweetsApi.getByUser(userId);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tweetsApi.create,
    onSuccess: () => {
      // Invalidate tweets list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all });
    },
  });
};

export const useUpdateTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTweetRequest }) =>
      tweetsApi.update(id, data),
    onSuccess: (response, { id }) => {
      // Update the specific tweet in cache
      queryClient.setQueryData(queryKeys.tweets.detail(id), response.data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all });
    },
  });
};

export const useDeleteTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tweetsApi.delete,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.tweets.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all });
    },
  });
};

export const useLikeTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tweetsApi.like,
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: queryKeys.tweets.detail(id),
      });
      const previousTweet = queryClient.getQueryData(
        queryKeys.tweets.detail(id)
      );

      queryClient.setQueryData(queryKeys.tweets.detail(id), (old: any) => ({
        ...old,
        likes: old.likes + 1,
        isLiked: true,
      }));

      return { previousTweet };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousTweet) {
        queryClient.setQueryData(
          queryKeys.tweets.detail(id),
          context.previousTweet
        );
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tweets.detail(id) });
    },
  });
};

export const useUnlikeTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tweetsApi.unlike,
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.tweets.detail(id),
      });
      const previousTweet = queryClient.getQueryData(
        queryKeys.tweets.detail(id)
      );

      queryClient.setQueryData(queryKeys.tweets.detail(id), (old: any) => ({
        ...old,
        likes: old.likes - 1,
        isLiked: false,
      }));

      return { previousTweet };
    },
    onError: (err, id, context) => {
      if (context?.previousTweet) {
        queryClient.setQueryData(
          queryKeys.tweets.detail(id),
          context.previousTweet
        );
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tweets.detail(id) });
    },
  });
};
