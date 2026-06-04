import { errorResponse } from "@/lib/api-response";

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[api] ${error.statusCode}`, error.message);
    }
    return errorResponse(error.message, error.statusCode, error.details);
  }

  if (error instanceof Error) {
    console.error("[api]", error.message);
    return errorResponse(
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
      500,
    );
  }

  return errorResponse("Internal server error", 500);
}
