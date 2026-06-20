import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "../types/types";
import { ApiSuccessResponse } from "@mta/common";
import { apiClient } from "../clients/api.client";
import { queryKeys } from "../clients/query.client";

const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiSuccessResponse<LoginResponse>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    apiClient.post<ApiSuccessResponse<LoginResponse>>("/auth/register", data),

  getCurrentUser: () => apiClient.get<ApiSuccessResponse<User>>("/auth/me"),

  logout: () => apiClient.post<ApiSuccessResponse<void>>("/auth/logout"),
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      apiClient.setToken(response.data.token);
      queryClient.setQueryData(queryKeys.auth.currentUser, response.data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response: ApiSuccessResponse<LoginResponse>) => {
      apiClient.setToken(response.data.token);
      queryClient.setQueryData(queryKeys.auth.currentUser, response.data.user);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    enabled: !!apiClient.getToken(),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      apiClient.clearToken();
      queryClient.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
};
