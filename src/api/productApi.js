import axios from "axios";

const API = "http://localhost:8080/api/products";

export const getAllProducts = () => {
  return axios.get(`${API}`);
};
