import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ;

export const http = axios.create({
  baseURL: BASE_URL,
});

// ✅ inyecta token a todas las requests
http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ opcional: normalizar errores
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.msg ||
      err?.message ||
      "Error de servidor";
    return Promise.reject(new Error(msg));
  }
);
