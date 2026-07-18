import api from "./axios";

export const getUsers = (params) => {
  return api.get("/user", { params });
}

export const getUserById = (id) => {
  return api.get(`/user/${id}`);
}

export const createUser = (data) => {
  return api.post("/user", data);
}

export const updateUser = (id, data) => {
  return api.put(`/user/${id}`, data);
}

export const deleteUser = (id) => {
  return api.delete(`/user/${id}`);
}

export const getUserSummary = () => {
  return api.get("/user/summary");
}

export const getUserFilterOptions = () => {
  return api.get("/user/filter-options");
}

export const exportUserData = (params) => {
  return api.get("/user/export", { params, responseType: "blob" });
}

export const bulkUpdateUserStatus = (ids, status) => {
  return api.post("/user/bulk-status", { ids, status });
}

export const bulkDeleteUsers = (ids) => {
  return api.post("/user/bulk-delete", { ids });
}

export const resetUserPassword = (id, password) => {
  return api.put(`/user/${id}/reset-password`, { password });
}

export const importUsers = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/user/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}