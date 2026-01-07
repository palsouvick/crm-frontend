import api from "./axios";

export const getEmailTemplates = () => {
  return api.get("/email-templates");
}

export const createEmailTemplate = (data) => {
  return api.post("/email-templates", data);
}

export const updateEmailTemplate = (id, data) => {
  return api.put(`/email-templates/${id}`, data);
}

export const deleteEmailTemplate = (id) => {
  return api.delete(`/email-templates/${id}`);
}

export const getEmailTemplateById = (id) => {
  return api.get(`/email-templates/${id}`);
}