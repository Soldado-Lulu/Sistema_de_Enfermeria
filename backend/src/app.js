import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";

import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import catalogRoutes from "./modules/catalog/catalog.routes.js";
import rolesAdminRoutes from "./modules/admin/roles.routes.js";

import { errorHandler } from "./middlewares/error.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/catalog", catalogRoutes);
app.use("/api/admin/roles", rolesAdminRoutes);

  app.use(errorHandler);
  return app;
}
