import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type Cause = {
  status?: number;
  code?: string;
  details?: unknown;
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let status = 500;
  const payload: Record<string, unknown> = { error: "Internal Server Error" };

  if (err instanceof ZodError) {
    status = 400;
    payload.error = "ValidationError";
    payload.details = err.flatten();
  } else if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      status = 409;
      payload.error = "Unique constraint violation";
      payload.details = err.meta;
    } else if (err.code === "P2025") {
      status = 404;
      payload.error = "Record not found";
      payload.details = err.meta;
    } else {
      status = 400;
      payload.error = `Prisma error (${err.code})`;
      payload.details = err.meta;
    }
  } else if (err instanceof Error) {
    const cause = (err as Error & { cause?: Cause }).cause;
    const maybeStatus = cause?.status;
    status = Number.isInteger(maybeStatus) ? (maybeStatus as number) : 500;
    payload.error = err.message || "Internal Server Error";
    if (cause?.details !== undefined) payload.details = cause.details;
  } else {
    payload.error = "Unknown error";
    payload.details = err;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", err);
  }

  res.status(status).json({ statusCode: status, ...payload });
}
