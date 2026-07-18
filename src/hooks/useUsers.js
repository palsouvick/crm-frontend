import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserSummary,
  getUserFilterOptions,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  bulkUpdateUserStatus,
  bulkDeleteUsers,
  importUsers,
} from "../api/userApi";
import useCrudMutation from "./useCrudMutation";

export const useUsersList = (params) => {
  return useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => getUsers(params).then((res) => res.data),
  });
};

export const useUserSummary = () => {
  return useQuery({
    queryKey: ["users", "summary"],
    queryFn: () => getUserSummary().then((res) => res.data),
  });
};

export const useUserFilterOptions = () => {
  return useQuery({
    queryKey: ["users", "filter-options"],
    queryFn: () => getUserFilterOptions().then((res) => res.data),
    staleTime: Infinity,
  });
};

export const useCreateUser = () =>
  useCrudMutation({ mutationFn: createUser, queryKey: ["users"] });

export const useUpdateUser = () =>
  useCrudMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    queryKey: ["users"],
  });

export const useDeleteUser = () =>
  useCrudMutation({ mutationFn: deleteUser, queryKey: ["users"] });

export const useResetUserPassword = () =>
  useCrudMutation({
    mutationFn: ({ id, password }) => resetUserPassword(id, password),
    queryKey: ["users"],
  });

export const useBulkUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }) => bulkUpdateUserStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "summary"] });
    },
  });
};

export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => bulkDeleteUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "summary"] });
    },
  });
};

export const useImportUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => importUsers(file).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["users", "filter-options"] });
    },
  });
};
