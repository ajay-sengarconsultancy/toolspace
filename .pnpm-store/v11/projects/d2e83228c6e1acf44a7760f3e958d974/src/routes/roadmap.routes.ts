import { Router } from "express";
import { listRoadmap } from "../services/roadmap.service.ts";
import { roadmapQuerySchema } from "../validation/roadmap.schema.ts";

const roadmapRouter = Router();

roadmapRouter.get("/", async (request, response) => {
  const query = roadmapQuerySchema.parse(request.query);
  const result = await listRoadmap(query);
  response.json({ success: true, data: result.data, meta: result.meta });
});

export { roadmapRouter };
