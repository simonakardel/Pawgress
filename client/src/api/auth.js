import {
  apiRequest
} from "./instance";

const register = (data) => apiRequest("post", "/signup", data);
const login = (data) => apiRequest("post", "/login", data);
const logout = () => apiRequest("delete", "/logout");
const refreshToken = () => apiRequest("post", "/token");



const AuthAPI = {
  register,
  login,
  logout,
  refreshToken,
};

export default AuthAPI;