import { BaseError } from "../errors/custom-errors";
import type { ApiResponse, RestaurantFormatForDatabase } from "../interfaces/gloabal-types";
import type { SearchRestaurantsParams } from "../interfaces/gloabal-types";
import type { RestaurantService } from "../services/restaurant.service";
//import type { RouteHandler } from "../types/route-handler";
import type { Request, Response } from "express";
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {
    this.restaurantService = restaurantService;
  }

  /**
   * Fetches restaurants from the database
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   */
  public getFinancials = async (req: Request, res: Response) => {
    try {
      const searchParams: SearchRestaurantsParams = {
        location: String(req.query.location),
        term: String(req.query.term),
        categories: String(req.query.categories),
        open_now: Boolean(req.query.open_now),
        limit: Number(req.query.limit),
      };

      const restaurants = await this.getRestaurants(searchParams);
      res.status(200).json(restaurants);
    } catch (error) {
      if (error instanceof BaseError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        console.log(`[Unknown Error] ${error}`, error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  };

  /**
   * Fetches restaurants from the database
   * @param {SearchRestaurantsParams} searchParams - The search parameters
   * @returns {Promise<ApiResponse<RestaurantFormatForDatabase[]>>} - The restaurants
   */
  private async getRestaurants(
    searchParams: SearchRestaurantsParams,
  ): Promise<ApiResponse<RestaurantFormatForDatabase[]>> {
    try {
      const result = await this.restaurantService.fetchDataFromDatabase(searchParams);
      return result;
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        console.error(`[${error.name}] ${error.message}`, error);
        throw error;
      }
      console.error(`[Unknown Error] ${error}`, error);
      throw error;
    }
  }
}
