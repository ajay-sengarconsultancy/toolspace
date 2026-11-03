import { prisma } from "../db/prisma.ts";
import { HttpError } from "../errors/http-error.ts";
import type { RoadmapQuery } from "../validation/roadmap.schema.ts";

export async function listRoadmap(query: RoadmapQuery) {
  const { search, category, status, sort, page, limit } = query;
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
      select: {
        id: true,
        title: true,
        description: true,
        useCase: true,
        status: true,
        eta: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { votes: true } },
      },
      orderBy: sort === "popular"
        ? [{ votes: { _count: "desc" } }, { updatedAt: "desc" }]
        : [{ createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.toolRequest.count({ where }),
  ]);

  return {
    data: requests.map(({ _count, ...request }) => ({
      ...request,
      eta: request.eta ?? null,
      voteCount: _count.votes,
    })),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function addRequestVote(requestId: string, voterKey: string) {
  try {
    return await prisma.$transaction(async (transaction) => {
      const request = await transaction.toolRequest.findUnique({
        where: { id: requestId },
        select: { id: true, status: true },
      });
      if (!request) throw new HttpError(404, "Request not found");
      if (request.status === "AVAILABLE") throw new HttpError(409, "Voting is closed for this request");

      await transaction.requestVote.create({ data: { requestId, voterKey } });
      const voteCount = await transaction.requestVote.count({ where: { requestId } });
      return { voteCount };
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new HttpError(409, "You have already voted for this request");
    }
    throw error;
  }
}

export async function removeRequestVote(requestId: string, voterKey: string) {
  return prisma.$transaction(async (transaction) => {
    const request = await transaction.toolRequest.findUnique({
      where: { id: requestId },
      select: { id: true },
    });
    if (!request) throw new HttpError(404, "Request not found");

    const deleted = await transaction.requestVote.deleteMany({ where: { requestId, voterKey } });
    const voteCount = await transaction.requestVote.count({ where: { requestId } });
    return { voteCount, removed: deleted.count > 0 };
  });
}

export async function getRequestVoteStatus(requestId: string, voterKey: string) {
  const request = await prisma.toolRequest.findUnique({
    where: { id: requestId },
    select: { id: true },
  });
  if (!request) throw new HttpError(404, "Request not found");

  const [vote, voteCount] = await Promise.all([
    prisma.requestVote.findUnique({
      where: { requestId_voterKey: { requestId, voterKey } },
      select: { id: true },
    }),
    prisma.requestVote.count({ where: { requestId } }),
  ]);

  return { hasVoted: Boolean(vote), voteCount };
}
