import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../clients/api.client";
import { queryKeys } from "../clients/query.client";
import { User, UpdateUserRequest } from "../types/types";
import { ApiSuccessResponse } from "@mta/common";

export const usersApi = {
  getById: (id: string) =>
    apiClient.get<ApiSuccessResponse<User>>(`/users/${id}`),

  getByUsername: (username: string) =>
    apiClient.get<ApiSuccessResponse<User>>(`/users/username/${username}`),

  update: (id: string, data: UpdateUserRequest) =>
    apiClient.put<ApiSuccessResponse<User>>(`/users/${id}`, data),

  follow: (id: string) =>
    apiClient.post<ApiSuccessResponse<void>>(`/users/${id}/follow`),

  unfollow: (id: string) =>
    apiClient.delete<ApiSuccessResponse<void>>(`/users/${id}/follow`),
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const response = await usersApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: queryKeys.users.profile(username),
    queryFn: async () => {
      const response = await usersApi.getByUsername(username);
      return response.data;
    },
    enabled: !!username,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.update(id, data),
    onSuccess: (response, { id }) => {
      queryClient.setQueryData(queryKeys.users.detail(id), response.data);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
  });
};
