import { prisma } from "../db/prisma.ts";
import { HttpError } from "../errors/http-error.ts";
import type { ToolsQuery } from "../validation/tools-query.schema.ts";

export async function listCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { tools: { where: { isActive: true } } },
      },
    },
  });

  return categories.map(({ _count, ...category }) => ({
    ...category,
    activeToolCount: _count.tools,
  }));
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      tools: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!category) throw new HttpError(404, "Category not found");
  return category;
}

export async function listTools(query: ToolsQuery) {
  const { search, category, pricing, page, limit } = query;
  const where = {
    isActive: true,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(category ? { category: { is: { slug: category } } } : {}),
    ...(pricing ? { pricingType: pricing } : {}),
  };

  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.tool.count({ where }),
  ]);

  return {
    data: tools,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getToolBySlug(slug: string) {
  const tool = await prisma.tool.findFirst({
    where: { slug, isActive: true },
    include: { category: true },
  });

  if (!tool) throw new HttpError(404, "Tool not found");
  return tool;
}
