import { z } from "zod";

const requestStatuses = [
  "REQUESTED",
  "UNDER_REVIEW",
  "SCHEDULED",
  "IN_DEVELOPMENT",
  "AVAILABLE",
] as const;

const voterKey = z.string().trim().min(1).max(128);

export const roadmapQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  status: z.enum(requestStatuses).optional(),
  sort: z.enum(["popular", "recent"]).default("popular"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
}).strict();

export const voteBodySchema = z.object({ voterKey }).strict();
export const voterKeyQuerySchema = z.object({ voterKey }).strict();

export type RoadmapQuery = z.infer<typeof roadmapQuerySchema>;
