import { Route, Tags, Controller, Get, Query, SuccessResponse, Middlewares } from "tsoa";
import { RestaurantController } from "../controllers/restaurant.controller";
import type { RestaurantFormatForDatabase, SearchRestaurantsParams, ApiResponse } from "../interfaces/gloabal-types";
import { RestaurantService } from "../services/restaurant.service";
import { validateSearchParams } from "../midlelware/middleware";

@Route("reeftech/v0")
@Tags("ReefV0Financials")
export class ReefV0FinancialsController extends Controller {
  /**
   * Get financials for a given location, term, categories, open_now, and limit
   * @param location - The location to search for
   * @param term - The term to search for
   * @param categories - The categories to search for
   * @param open_now - Whether to search for open restaurants
   * @param limit - The maximum number of results to return
   * @returns A string of financials
   */
  @SuccessResponse("200", "OK")
  @Get("financials")
  @Middlewares([validateSearchParams])
  public async getFinancials(
    @Query() location: string,
    @Query() term: string,
    @Query() categories: string,
    @Query() open_now: boolean,
    @Query() limit: number,
  ): Promise<ApiResponse<RestaurantFormatForDatabase[]>> {
    try {
      const restaurantService = new RestaurantService();
      const restaurantController = new RestaurantController(restaurantService);

      const searchParams: SearchRestaurantsParams = {
        location,
        term,
        categories,
        open_now,
        limit,
      };
      const restaurants = await restaurantController.getRestaurants(searchParams);
      return restaurants;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
        throw new Error("An unknown error occurred");
    }
  }
}
