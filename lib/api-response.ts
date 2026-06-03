import { NextResponse } from "next/server";

export interface ApiSuccessPayload<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  errors?: unknown;
}

export function successResponse<T>(
  data: T,
  message = "Success",
  meta?: Record<string, unknown> | object,
  status = 200,
): NextResponse<ApiSuccessPayload<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(meta ? { meta: meta as Record<string, unknown> } : {}),
    },
    { status },
  );
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: unknown,
): NextResponse<ApiErrorPayload> {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors !== undefined ? { errors } : {}),
    },
    { status },
  );
}

/** @deprecated Use successResponse */
export const apiSuccess = <T>(
  message: string,
  data: T,
  options?: { status?: number; meta?: Record<string, unknown> },
) => successResponse(data, message, options?.meta, options?.status ?? 200);

/** @deprecated Use errorResponse */
export const apiError = errorResponse;
