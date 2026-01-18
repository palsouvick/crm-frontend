import api from "./axios";

export const getActivities = (params) => {
    return api.get("/activity", {params});
};

export const totalActivities = () => {
    return api.get("/activity/count");
}