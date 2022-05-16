import { ErrorRequestHandler } from "express";
import { UnhandledException } from "../models/errors";

export const genericErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  res
    .status(err.statusCode || 500)
    .send(err?.message ? err : UnhandledException);
  next(err);
};
