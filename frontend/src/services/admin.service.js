import { http } from "../api/http";

export const adminService = {
  pending: () => http.get("/api/admin/users/pending"),
  approve: (id, payload) => http.patch(`/api/admin/users/${id}/approve`, payload),
  disable: (id) => http.patch(`/api/admin/users/${id}/disable`),
  approved: (query = "") => http.get(`/api/admin/users/approved${query}`),
  updateUser: (id, payload) => http.patch(`/api/admin/users/${id}`, payload),
};
