import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    data: { status: "ok", service: "founderskit-api" },
  });
});

export { healthRouter };
