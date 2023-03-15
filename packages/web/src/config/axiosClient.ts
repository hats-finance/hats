import axios from "axios";
import { BASE_SERVICE_URL } from "settings";

export const axiosClient = axios.create({
  baseURL: BASE_SERVICE_URL,
  withCredentials: true,
});
