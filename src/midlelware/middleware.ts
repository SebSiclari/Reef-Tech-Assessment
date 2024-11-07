import type { NextFunction, Request, Response } from "express";
import type { SearchRestaurantsParams } from "../interfaces/gloabal-types";
import { ValidationError } from "../errors/custom-errors";

export const validateSearchParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, term, categories, open_now, limit, page, sortBy, order } =
      req.query as unknown as SearchRestaurantsParams;
    if (!location) {
      throw new ValidationError("Location is required", 400);
    }
    if (page) {
      const pageNum = Number(page);
      if (Number.isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError("Page must be a number greater than 0", 400);
      }
    }

    if (sortBy && !["date", "store_name"].includes(sortBy)) {
      throw new ValidationError("Sort by must be either 'date' or 'store_name'", 400);
    }
    if (order && !["asc", "desc"].includes(order)) {
      throw new ValidationError("Order must be either 'asc' or 'desc'", 400);
    }
    if (term && typeof term !== "string") {
      throw new ValidationError("Term must be a string", 400);
    }
    if (categories && typeof categories !== "string") {
      throw new ValidationError("Categories must be a string", 400);
    }
    if (open_now && typeof open_now !== "string") {
      throw new ValidationError("Open now must be a boolean", 400);
    }
    if (limit) {
      const limitNum = Number(limit);
      if (Number.isNaN(limitNum) || limitNum < 1) {
        throw new ValidationError("Limit must be a number", 400);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
