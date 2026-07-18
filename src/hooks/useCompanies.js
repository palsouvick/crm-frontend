import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCompanies,
  getCompanySummary,
  getCompanyFilterOptions,
  createCompany,
  updateCompany,
  deleteCompany,
  bulkAssignCompanyOwner,
  bulkUpdateCompanyStatus,
  bulkDeleteCompanies,
} from "../api/companyApi";
import useCrudMutation from "./useCrudMutation";

export const useCompaniesList = (params) => {
  return useQuery({
    queryKey: ["companies", "list", params],
    queryFn: () => getCompanies(params).then((res) => res.data),
  });
};

export const useCompanySummary = () => {
  return useQuery({
    queryKey: ["companies", "summary"],
    queryFn: () => getCompanySummary().then((res) => res.data),
  });
};

export const useCompanyFilterOptions = () => {
  return useQuery({
    queryKey: ["companies", "filter-options"],
    queryFn: () => getCompanyFilterOptions().then((res) => res.data),
    staleTime: Infinity,
  });
};

export const useCreateCompany = () =>
  useCrudMutation({ mutationFn: createCompany, queryKey: ["companies"] });

export const useUpdateCompany = () =>
  useCrudMutation({
    mutationFn: ({ id, data }) => updateCompany(id, data),
    queryKey: ["companies"],
  });

export const useDeleteCompany = () =>
  useCrudMutation({ mutationFn: deleteCompany, queryKey: ["companies"] });

export const useBulkAssignOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, ownerIds }) => bulkAssignCompanyOwner(ids, ownerIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      queryClient.invalidateQueries({ queryKey: ["companies", "summary"] });
    },
  });
};

export const useBulkUpdateCompanyStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }) => bulkUpdateCompanyStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      queryClient.invalidateQueries({ queryKey: ["companies", "summary"] });
    },
  });
};

export const useBulkDeleteCompanies = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => bulkDeleteCompanies(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      queryClient.invalidateQueries({ queryKey: ["companies", "summary"] });
    },
  });
};
