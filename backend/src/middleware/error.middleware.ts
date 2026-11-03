import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../errors/http-error.ts";

const errorMiddleware: ErrorRequestHandler = (error, request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      error: {
        message: request.method === "GET" ? "Invalid query parameters" : "Invalid request body",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      success: false,
      error: { message: error.message },
    });
    return;
  }

  const candidateStatus = Number(error?.statusCode ?? error?.status);
  const status = candidateStatus >= 400 && candidateStatus < 600 ? candidateStatus : 500;

  response.status(status).json({
    success: false,
    error: {
      message: status >= 500 ? "An unexpected error occurred." : "Request failed.",
    },
  });
};

export { errorMiddleware };
