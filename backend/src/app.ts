import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware.ts";
import { notFoundMiddleware } from "./middleware/not-found.middleware.ts";
import { categoriesRouter } from "./routes/categories.routes.ts";
import { healthRouter } from "./routes/health.routes.ts";
import { requestsRouter } from "./routes/requests.routes.ts";
import { roadmapRouter } from "./routes/roadmap.routes.ts";
import { toolsRouter } from "./routes/tools.routes.ts";

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/roadmap", roadmapRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
