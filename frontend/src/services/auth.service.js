import { http } from "../api/http";

export const authService = {
  login: (payload) => http.post("/api/auth/login", payload),
  register: (payload) => http.post("/api/auth/register", payload),
  me: () => http.get("/api/auth/me"),
};
