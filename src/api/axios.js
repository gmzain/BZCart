import axios from "axios";

const API_URL = "https://bzbackend.online/api"; // Match your backend URL

const instance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("myUser"));
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
