import axios from "axios";
import { BASE_API } from "./url";

const axiosInstance = axios.create({
  baseURL: BASE_API,
  headers: {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": BASE_API,
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  },
  withCredentials: true,
});

export default axiosInstance;
