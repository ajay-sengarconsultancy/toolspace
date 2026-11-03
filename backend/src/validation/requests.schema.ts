import { z } from "zod";

const requestStatusValues = [
  "REQUESTED",
  "UNDER_REVIEW",
  "SCHEDULED",
  "IN_DEVELOPMENT",
  "AVAILABLE",
] as const;

export const createRequestSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(3000),
  useCase: z.string().trim().max(2000).optional().transform((value) => value || undefined),
  categoryId: z.string().trim().max(64).optional().transform((value) => value || undefined),
}).strict();

export const requestsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  status: z.enum(requestStatusValues).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
}).strict();

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type RequestsQuery = z.infer<typeof requestsQuerySchema>;
