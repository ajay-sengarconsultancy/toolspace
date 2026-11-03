import { Router } from "express";
import { getCategoryBySlug, listCategories } from "../services/catalog.service.ts";

const categoriesRouter = Router();

categoriesRouter.get("/", async (_request, response) => {
  const categories = await listCategories();
  response.json({ success: true, data: categories });
});

categoriesRouter.get("/:slug", async (request, response) => {
  const category = await getCategoryBySlug(request.params.slug);
  response.json({ success: true, data: category });
});

export { categoriesRouter };
