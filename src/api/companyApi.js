import api from "./axios";

export const getCompanies = (params) => {
    return api.get("/company", { params });
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

export const getCompanySummary = () => {
    return api.get("/company/summary");
};

export const getCompanyFilterOptions = () => {
    return api.get("/company/filter-options");
};

export const exportCompanyData = (params) => {
    return api.get("/company/export", { params, responseType: "blob" });
};

export const bulkAssignCompanyOwner = (ids, ownerIds) => {
    return api.post("/company/bulk-assign-owner", { ids, ownerIds });
};

export const bulkUpdateCompanyStatus = (ids, status) => {
    return api.post("/company/bulk-status", { ids, status });
};

export const bulkDeleteCompanies = (ids) => {
    return api.post("/company/bulk-delete", { ids });
};