import { http } from "../api/http";

export const catalogService = {
  roles: () => http.get("/api/catalog/roles"),
  establecimientos: () => http.get("/api/catalog/establecimientos"),
};
