import axios from "axios";
import {store} from "../redux/store";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  if (state.auth.token) {
    config.headers.Authorization = `Bearer ${state.auth.token}`;
  }
  return config;
});

export default apiClient;
