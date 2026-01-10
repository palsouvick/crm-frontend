import api from "./axios";

export const getLeads = (params) => {
  return api.get("/lead", { params });
};

export const createLead = (data) => {
  return api.post("/lead", data);
};

export const updateLead = (id, data) => {
  return api.put(`/lead/${id}`, data);
};

export const getLeadById = (id) => {
  return api.get(`/lead/${id}`);
}

export const totalLeads = () => {
  return api.get("/lead/count");
}

export const deleteLead = (id) => {
  return api.delete(`/lead/${id}`);
}