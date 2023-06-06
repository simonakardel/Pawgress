import {
  apiRequest
} from "./instance";

const register = (data) => apiRequest("post", "/signup", data);
const login = (data) => apiRequest("post", "/login", data);
const logout = () => apiRequest("delete", "/logout");



const AuthAPI = {
  register,
  login,
  logout
};

export default AuthAPI;