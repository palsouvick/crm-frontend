import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCampaigns,
  getCampaignSummary,
  getCampaignFilterOptions,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  duplicateCampaign,
  pauseCampaign,
  resumeCampaign,
  archiveCampaign,
  sendTestEmail,
  bulkPauseCampaigns,
  bulkResumeCampaigns,
  bulkArchiveCampaigns,
  bulkDeleteCampaigns,
} from "../api/campaignApi";
import useCrudMutation from "./useCrudMutation";

export const useCampaignsList = (params) => {
  return useQuery({
    queryKey: ["campaigns", "list", params],
    queryFn: () => getCampaigns(params).then((res) => res.data),
  });
};

export const useCampaignSummary = () => {
  return useQuery({
    queryKey: ["campaigns", "summary"],
    queryFn: () => getCampaignSummary().then((res) => res.data),
  });
};

export const useCampaignFilterOptions = () => {
  return useQuery({
    queryKey: ["campaigns", "filter-options"],
    queryFn: () => getCampaignFilterOptions().then((res) => res.data),
    staleTime: Infinity,
  });
};

export const useCreateCampaign = () =>
  useCrudMutation({ mutationFn: createCampaign, queryKey: ["campaigns"] });

export const useUpdateCampaign = () =>
  useCrudMutation({
    mutationFn: ({ id, data }) => updateCampaign(id, data),
    queryKey: ["campaigns"],
  });

export const useDeleteCampaign = () =>
  useCrudMutation({ mutationFn: deleteCampaign, queryKey: ["campaigns"] });

export const useDuplicateCampaign = () =>
  useCrudMutation({ mutationFn: duplicateCampaign, queryKey: ["campaigns"] });

export const usePauseCampaign = () =>
  useCrudMutation({ mutationFn: pauseCampaign, queryKey: ["campaigns"] });

export const useResumeCampaign = () =>
  useCrudMutation({ mutationFn: resumeCampaign, queryKey: ["campaigns"] });

export const useArchiveCampaign = () =>
  useCrudMutation({ mutationFn: archiveCampaign, queryKey: ["campaigns"] });

export const useSendTestEmail = () =>
  useMutation({ mutationFn: ({ id, data }) => sendTestEmail(id, data) });

const useBulkCampaignMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", "list"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", "summary"] });
    },
  });
};

export const useBulkPauseCampaigns = () => useBulkCampaignMutation(bulkPauseCampaigns);
export const useBulkResumeCampaigns = () => useBulkCampaignMutation(bulkResumeCampaigns);
export const useBulkArchiveCampaigns = () => useBulkCampaignMutation(bulkArchiveCampaigns);
export const useBulkDeleteCampaigns = () => useBulkCampaignMutation(bulkDeleteCampaigns);
