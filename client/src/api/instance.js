import axios from "axios";


const axiosAPI = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});


export const apiRequest = async (method, url, data = null) => {
  try {
    const res = await axiosAPI({
      method,
      url,
      data,
    });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};