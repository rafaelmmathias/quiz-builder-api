import { RequestHandler } from "express";
import { UnauthorizedException } from "../models/errors";
import { adminApp } from "../server";

export const authorize: RequestHandler = async (req, res, next) => {
  if (!req.headers.authorization) return next(UnauthorizedException);

  try {
    const user = await adminApp.auth().verifyIdToken(req.headers.authorization);

    res.locals = { user };
    next();
  } catch (err) {
    next(UnauthorizedException);
  }
};
