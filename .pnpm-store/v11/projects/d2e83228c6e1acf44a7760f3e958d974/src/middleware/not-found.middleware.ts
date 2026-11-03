import type { Request, Response } from "express";

function notFoundMiddleware(request: Request, response: Response): void {
  response.status(404).json({
    success: false,
    error: {
      message: `No route found for ${request.method} ${request.originalUrl}`,
    },
  });
}

export { notFoundMiddleware };
