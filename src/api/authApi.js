import api from "./axios";

// Register API
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// Login API
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const fetchUserProfile = () => {
  return api.get("/auth/profile");
};

export const updateUserProfile = (data) => {
  return api.put("/auth/profile", data);
};