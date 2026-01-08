import api from "./axios";

export const getFollowUps = (params) => {
    return api.get("/follow-ups", {params});
} 

export const createFollowUp = (data) => {
    return api.post("/follow-ups", data);
}

export const updateFollowUp = (id, data) => {
    return api.put(`/follow-ups/${id}`, data);
}

export const deleteFollowUp = (id) => {
    return api.delete(`/follow-ups/${id}`);
}

export const getFollowUpById = (id) => {
    return api.get(`/follow-ups/${id}`);
}

export const completeFollowUp = (id) => {
    return api.put(`/follow-ups/${id}/complete`);
}