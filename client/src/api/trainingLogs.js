import {
  apiRequest
} from "./instance";


const getTrainingLogs = () => apiRequest("get", "/training-logs");
const createTrainingLog = (data) => apiRequest("post", "/training-logs", data);


const LogsAPI = {
  getTrainingLogs,
  createTrainingLog
}

export default LogsAPI;