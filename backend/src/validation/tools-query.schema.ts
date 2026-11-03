import { z } from "zod";

export const toolsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  pricing: z.enum(["FREE", "FREEMIUM", "PAID"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
}).strict();

export type ToolsQuery = z.infer<typeof toolsQuerySchema>;
