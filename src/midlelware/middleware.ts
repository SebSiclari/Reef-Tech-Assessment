import { NextFunction, Request, Response } from "express";
import { SearchRestaurantsParams } from "../interfaces/gloabal-types";
import { ValidationError } from "../errors/custom-errors";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ValidationError) {
    res.status(400).json({ success: false, message: err.message });
  } else {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const validateSearchParams = (req: Request, next: NextFunction) => {
  const { location, term, categories, open_now, limit } = req.query as unknown as SearchRestaurantsParams;
  if (!location) {
    throw new ValidationError("Location is required");
  }
  if (term && typeof term !== "string") {
    throw new ValidationError("Term must be a string");
  }
  if (categories && typeof categories !== "string") {
    throw new ValidationError("Categories must be a string");
  }
  if (open_now && typeof open_now !== "boolean") {
    throw new ValidationError("Open now must be a boolean");
  }
  if (limit && typeof limit !== "number") {
    throw new ValidationError("Limit must be a number");
  }

  next();
};
