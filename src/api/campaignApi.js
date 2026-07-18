import api from "./axios";

export const getCampaigns = (params) => {
  return api.get("/campaigns", { params });
};

export const createCampaign = (data) => {
  return api.post("/campaigns", data);
};
export const updateCampaign = (id, data) => {
  return api.put(`/campaigns/${id}`, data);
}
export const deleteCampaign = (id) => {
  return api.delete(`/campaigns/${id}`);
}
export const getCampaignById = (id) => {
  return api.get(`/campaigns/${id}`);
}

export const startCampaign = (id) => {
  return api.post(`/campaigns/start/${id}`);
}

export const sendTestEmail = (id, data) => {
  return api.post(`/campaigns/send-test-email/${id}`, data);
}

export const duplicateCampaign = (id) => {
  return api.post(`/campaigns/${id}/duplicate`);
}

export const pauseCampaign = (id) => {
  return api.post(`/campaigns/${id}/pause`);
}

export const resumeCampaign = (id) => {
  return api.post(`/campaigns/${id}/resume`);
}

export const archiveCampaign = (id) => {
  return api.post(`/campaigns/${id}/archive`);
}

export const getCampaignSummary = () => {
  return api.get("/campaigns/summary");
}

export const getCampaignFilterOptions = () => {
  return api.get("/campaigns/filter-options");
}

export const exportCampaignData = (params) => {
  return api.get("/campaigns/export", { params, responseType: "blob" });
}

export const bulkPauseCampaigns = (ids) => {
  return api.post("/campaigns/bulk-pause", { ids });
}

export const bulkResumeCampaigns = (ids) => {
  return api.post("/campaigns/bulk-resume", { ids });
}

export const bulkArchiveCampaigns = (ids) => {
  return api.post("/campaigns/bulk-archive", { ids });
}

export const bulkDeleteCampaigns = (ids) => {
  return api.post("/campaigns/bulk-delete", { ids });
}