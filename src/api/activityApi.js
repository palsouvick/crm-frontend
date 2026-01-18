import api from "./axios";

export const getActivities = (params) => {
    return api.get("/activity", {params});
};