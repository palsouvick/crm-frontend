import api from "./axios";

export const getCompanies = () => {
    return api.get("/company");
};

export const getCompanyById = (id) => {
    return api.get(`/company/${id}`);
};

export const createCompany = (data) => {
    return api.post("/company", data);
};

export const updateCompany = (id, data) => {
    return api.put(`/company/${id}`, data);
};

export const deleteCompany = (id) => {
    return api.delete(`/company/${id}`);
};