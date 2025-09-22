import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import apiRouter from "./router/index.js";
import { env } from "./config/env.js";

const app = express();
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", apiRouter);

app.use((req, res) =>
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
);
app.use(errorHandler);

export default app;
