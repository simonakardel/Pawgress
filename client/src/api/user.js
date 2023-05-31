import { apiRequest } from "./instance";

const getDashboardData = () => apiRequest("get", "/user");
const updateUserData = (data) => apiRequest("patch", "/user", data);
const updateUserChallenge = (data) => apiRequest("patch", "/user-challenge", data);

const UserAPI = {
    getDashboardData,
    updateUserData,
    updateUserChallenge
}

export default UserAPI;