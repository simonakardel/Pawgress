import {
    apiRequest
} from "./instance";


const getCurrentGoals = () => apiRequest("get", "/current-goals");
const getAchievedGoals = () => apiRequest("get", "/achieved-goals");
const createGoal = (data) => apiRequest("post", "/goals", data);
const updateGoal = (id, data) => apiRequest("patch", `/current-goals/${id}`, data);
const deleteGoal = (id) => apiRequest("delete", `goals/${id}`);

const GoalAPI = {
    getCurrentGoals,
    getAchievedGoals,
    createGoal,
    updateGoal,
    deleteGoal

}

export default GoalAPI;