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