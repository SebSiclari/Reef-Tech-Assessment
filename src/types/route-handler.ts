import type { Request, Response, NextFunction } from "express";

export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
) => Promise<void | Response>;
