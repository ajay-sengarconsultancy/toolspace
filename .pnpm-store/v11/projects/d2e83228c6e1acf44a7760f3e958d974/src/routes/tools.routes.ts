import { Router } from "express";
import { getToolBySlug, listTools } from "../services/catalog.service.ts";
import { toolsQuerySchema } from "../validation/tools-query.schema.ts";

const toolsRouter = Router();

toolsRouter.get("/", async (request, response) => {
  const query = toolsQuerySchema.parse(request.query);
  const result = await listTools(query);

  response.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

toolsRouter.get("/:slug", async (request, response) => {
  const tool = await getToolBySlug(request.params.slug);
  response.json({ success: true, data: tool });
});

export { toolsRouter };
