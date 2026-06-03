import type { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error";

export type RouteContext<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>;
};

type RouteHandler = (
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any,
) => Promise<Response>;

export function asyncHandler(handler: RouteHandler) {
  return async (request: NextRequest, context?: RouteContext): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
