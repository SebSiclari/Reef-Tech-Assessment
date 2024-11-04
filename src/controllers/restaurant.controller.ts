import type { ApiResponse, RestaurantFormatForDatabase } from "../interfaces/gloabal-types";
import type { SearchRestaurantsParams } from "../interfaces/gloabal-types";
import { RestaurantService } from "../services/restaurant.service";

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService = new RestaurantService()) {}

  public async getRestaurants(
    searchParams: SearchRestaurantsParams,
  ): Promise<ApiResponse<RestaurantFormatForDatabase[]>> {
    try {
      const result = await this.restaurantService.fetchDataFromDatabase(searchParams);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`[${error.name}] ${error.message}`, error);
      } else {
        console.error(`[Unknown Error] ${error}`, error);
      }
      throw error;
    }
  }
}
