import type { YelpClient } from "../thirdParty/yelp/client";
import type { YelpSearchResponse } from "../thirdParty/yelp/types";
import { BaseError, DatabaseError, MappingError, ValidationError, YelpApiError } from "../errors/custom-errors";
import type { YelpBusiness } from "../thirdParty/yelp/types";
import type { SearchRestaurantsParams, ApiResponse } from "../interfaces/gloabal-types";
import type { PrismaClient } from "@prisma/client";
import { validateRestaurantFormatForDatabase } from "../utils/validator";
import type { RestaurantFormatForDatabase } from "../interfaces/gloabal-types";

export class RestaurantService {
  constructor(
    private readonly yelpClient: YelpClient,
    private readonly prisma: PrismaClient,
  ) {
    this.yelpClient = yelpClient;
    this.prisma = prisma;
  }

  private parseOpeningHours(restaurant: YelpBusiness): Date {
    const now = new Date();
    try {
      if (restaurant?.business_hours?.[0]?.open[0]) {
        const openingTime = restaurant.business_hours[0].open[0].start;
        // Split time into hours and minutes
        const hour = Number.parseInt(openingTime.slice(0, 2)); // e.g. "12" -> 12
        const minute = Number.parseInt(openingTime.slice(2, 4)); // e.g. "00" -> 0
        now.setHours(hour, minute, 0, 0);

        return now;
      }
      // we default to 9am if we cannot find the opening hours
      now.setHours(9, 0, 0, 0);
      return now;
    } catch (error) {
      console.error(error);
      now.setHours(9, 0, 0, 0);
      return now;
    }
  }

  async mapRestaurantsToDatabaseSchema(searchParams: SearchRestaurantsParams): Promise<RestaurantFormatForDatabase[]> {
    try {
      const restaurantInfo: YelpSearchResponse = await this.yelpClient.getRestaurantsFromYelpAPI(searchParams);
      const mappedRestaurants: RestaurantFormatForDatabase[] = restaurantInfo.businesses.map(
        (restaurant: YelpBusiness) => {

          validateRestaurantFormatForDatabase(restaurant);
          return {
            store_name: restaurant.name,
            external_store_id: restaurant.id,
            country: restaurant.location.country || "US",
            country_code: restaurant.location.country || "US",
            city: restaurant.location.city,
            date: new Date(),
            restaurant_opened_at: this.parseOpeningHours(restaurant),
            menu_available: true, // Not available in the API so default to true
            restaurant_online: !restaurant.is_closed ? true : false,
            restaurant_offline: restaurant.is_closed ? true : false,
          };
        },
      );

      return mappedRestaurants;
    } catch (error: any) {
      if (error instanceof YelpApiError || error instanceof ValidationError) {
        console.error(`[${error.name}] ${error.message}`, error);
        throw error;
      }
      console.error(`[Unknown Error] ${error.message}`, error);
      throw new MappingError(`Failed to map restaurants to database schema: ${error.message}`, 500);
    }
  }

  async saveRestaurantsToDatabase(restaurants: RestaurantFormatForDatabase[]): Promise<void> {
    try {
      // Use transaction to ensure data consistency
      await this.prisma.$transaction(async (tx) => {
        // Process each restaurant
        for (const restaurant of restaurants) {
          // Use upsert to either update existing or create new
          await tx.restaurantData.upsert({
            where: {
              external_store_id: restaurant.external_store_id,
            },
            update: { ...restaurant },
            create: { ...restaurant },
          });
        }
      });
    } catch (error: any) {
      throw new DatabaseError("Failed to save restaurants to database", 500);
    }
  }

  async fetchDataFromDatabase(
    searchParams: SearchRestaurantsParams,
  ): Promise<ApiResponse<RestaurantFormatForDatabase[]>> {
    try {
      const { page = 1, limit = 10, sortBy = "date", order = "desc" } = searchParams;

      const mappedRestaurants = await this.mapRestaurantsToDatabaseSchema(searchParams);

      await this.saveRestaurantsToDatabase(mappedRestaurants);

      console.log("mappedRestaurants", mappedRestaurants);

      const skip = (page - 1) * limit;
      const fetchedRestaurants = await this.prisma.restaurantData.findMany({
        orderBy: {
          [sortBy]: order,
        },
        skip: skip || 0,
        take: limit ? limit : 10,
      });

      return {
        success: true,
        message: `Successfully synced ${mappedRestaurants.length} restaurants`,
        count: fetchedRestaurants.length,
        data: fetchedRestaurants,
      };
    } catch (error: any) {
      if (error instanceof BaseError) {
        console.error(`[${error.name}] ${error.message}`, error);
        throw error;
      }
      console.error(`[Unknown Error] ${error.message}`, error);
      throw new Error(`Failed to sync restaurants and return restaurants: ${error.message}`);
    }
  }
}
