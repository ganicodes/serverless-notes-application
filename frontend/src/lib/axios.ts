import axios from "axios";

const localAPIURL = () => {
  return import.meta.env.VITE_LOCAL_API_URL;
};

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: localAPIURL(),
  headers: { Authorization: localStorage.getItem("token") || "" },
});
