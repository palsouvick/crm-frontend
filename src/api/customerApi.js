import api from "./axios";

export const getCustomers = (params) => {
  return api.get("/customer", { params });
};

export const exportCustomerData = (params) => {
  return api.get("/customer/export", { params, responseType: "blob" });
}

export const getCustomerById = (id) => {
  return api.get(`/customer/${id}`);
};

export const createCustomer = (data) => {
  return api.post("/customer", data);
};
export const updateCustomer = (id, data) => {
  return api.put(`/customer/${id}`, data);
};
export const deleteCustomer = (id) => {
  return api.delete(`/customer/${id}`);
};
