import { Router } from "express";
import {
  createToolRequest,
  getToolRequestById,
  listToolRequests,
} from "../services/requests.service.ts";
import {
  addRequestVote,
  getRequestVoteStatus,
  removeRequestVote,
} from "../services/roadmap.service.ts";
import {
  createRequestSchema,
  requestsQuerySchema,
} from "../validation/requests.schema.ts";
import { voteBodySchema, voterKeyQuerySchema } from "../validation/roadmap.schema.ts";

const requestsRouter = Router();

requestsRouter.post("/", async (request, response) => {
  const input = createRequestSchema.parse(request.body);
  const createdRequest = await createToolRequest(input);

  response.status(201).json({
    success: true,
    data: createdRequest,
  });
});

requestsRouter.get("/", async (request, response) => {
  const query = requestsQuerySchema.parse(request.query);
  const result = await listToolRequests(query);

  response.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

requestsRouter.get("/:id", async (request, response) => {
  const toolRequest = await getToolRequestById(request.params.id);
  response.json({ success: true, data: toolRequest });
});

requestsRouter.post("/:id/votes", async (request, response) => {
  const { voterKey } = voteBodySchema.parse(request.body);
  const result = await addRequestVote(request.params.id, voterKey);
  response.status(201).json({ success: true, data: result });
});

requestsRouter.delete("/:id/votes", async (request, response) => {
  const { voterKey } = voteBodySchema.parse(request.body);
  const result = await removeRequestVote(request.params.id, voterKey);
  response.json({ success: true, data: result });
});

requestsRouter.get("/:id/votes/me", async (request, response) => {
  const { voterKey } = voterKeyQuerySchema.parse(request.query);
  const result = await getRequestVoteStatus(request.params.id, voterKey);
  response.json({ success: true, data: result });
});

export { requestsRouter };
