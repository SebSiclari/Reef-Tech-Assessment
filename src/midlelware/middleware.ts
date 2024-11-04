import type { NextFunction, Request, Response } from "express";
import type { SearchRestaurantsParams } from "../interfaces/gloabal-types";
import { ValidationError } from "../errors/custom-errors";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ValidationError) {
    res.status(400).json({ success: false, message: err.message });
  } else {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const validateSearchParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, term, categories, open_now, limit, page, sortBy, order } =
      req.query as unknown as SearchRestaurantsParams;
    if (!location) {
      throw new ValidationError("Location is required");
    }
    if (page) {
      const pageNum = Number(page);
      if (Number.isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError("Page must be a number greater than 0");
      }
    }

    if (sortBy && !["date", "store_name"].includes(sortBy)) {
      throw new ValidationError("Sort by must be either 'date' or 'store_name'");
    }
    if (order && !["asc", "desc"].includes(order)) {
      throw new ValidationError("Order must be either 'asc' or 'desc'");
    }
    if (term && typeof term !== "string") {
      throw new ValidationError("Term must be a string");
    }
    if (categories && typeof categories !== "string") {
      throw new ValidationError("Categories must be a string");
    }
    if (open_now && typeof open_now !== "string") {
      throw new ValidationError("Open now must be a boolean");
    }
    if (limit) {
      const limitNum = Number(limit);
      if (Number.isNaN(limitNum) || limitNum < 1) {
        throw new ValidationError("Limit must be a number");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
