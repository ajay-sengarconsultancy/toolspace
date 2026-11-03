import { prisma } from "../db/prisma.ts";
import { HttpError } from "../errors/http-error.ts";
import type { CreateRequestInput, RequestsQuery } from "../validation/requests.schema.ts";

const requestSummarySelect = {
  id: true,
  title: true,
  description: true,
  useCase: true,
  status: true,
  eta: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: { id: true, name: true, slug: true },
  },
} as const;

export async function createToolRequest(input: CreateRequestInput) {
  return prisma.$transaction(async (transaction) => {
    if (input.categoryId) {
      const category = await transaction.category.findUnique({
        where: { id: input.categoryId },
        select: { id: true },
      });

      if (!category) throw new HttpError(400, "Invalid categoryId");
    }

    const request = await transaction.toolRequest.create({
      data: {
        title: input.title,
        description: input.description,
        ...(input.useCase ? { useCase: input.useCase } : {}),
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        status: "REQUESTED",
        eta: null,
      },
      select: requestSummarySelect,
    });

    await transaction.requestStatusHistory.create({
      data: {
        requestId: request.id,
        previousStatus: null,
        newStatus: "REQUESTED",
        note: "Request submitted",
      },
    });

    return request;
  });
}

export async function listToolRequests(query: RequestsQuery) {
  const { search, category, status, page, limit } = query;
  const where = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(category ? { category: { is: { slug: category } } } : {}),
    ...(status ? { status } : {}),
  };

  const [requests, total] = await Promise.all([
    prisma.toolRequest.findMany({
      where,
      select: requestSummarySelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.toolRequest.count({ where }),
  ]);

  return {
    data: requests,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getToolRequestById(id: string) {
  const request = await prisma.toolRequest.findUnique({
    where: { id },
    select: {
      ...requestSummarySelect,
      statusHistory: {
        select: {
          previousStatus: true,
          newStatus: true,
          note: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!request) throw new HttpError(404, "Request not found");
  return request;
}
