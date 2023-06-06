import {
    apiRequest
} from "./instance";

const getChallenges = () => apiRequest("get", "/challenges");
const createChallenge = (data) => apiRequest("post", "/challenges", data);



const ChallengeAPI = {
    getChallenges,
    createChallenge,
}

export default ChallengeAPI;