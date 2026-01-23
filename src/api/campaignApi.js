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