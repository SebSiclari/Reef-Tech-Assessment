import { YelpClient } from "../thirdParty/yelp/client";
import { YelpSearchResponse } from "../thirdParty/yelp/types";
import { DatabaseError, YelpApiError } from "../errors/custom-errors";
import { YelpBusiness } from "../thirdParty/yelp/types";
import { SearchRestaurantsParams } from "../interfaces/gloabal-types";
import { PrismaClient } from "@prisma/client";

interface RestaurantFormatForDatabase {
	store_name: string;
	external_store_id: string;
	country: string;
	country_code: string;
	city: string;
	date: Date; // date of data entry
	restaurant_opened_at: Date; // time restaurant opened at
	menu_available: boolean; // if the menu is available
	restaurant_online: boolean; // if the restaurant is online
	restaurant_offline: boolean; // if the restaurant is offline
}

export class RestaurantService {
	constructor(
		private readonly yelpClient: YelpClient,
		private readonly prisma: PrismaClient,
	) {}

	// map the restaurants to the database schema

	private parseOpeningHours(restaurant: YelpBusiness): Date {
		const now = new Date();
		try {
			if (restaurant?.business_hours?.[0]?.open[0]) {
				const openingTime = restaurant.business_hours[0].open[0].start;
				// Split time into hours and minutes
				const hour = parseInt(openingTime.slice(0, 2)); // e.g. "12" -> 12
				const minute = parseInt(openingTime.slice(2, 4)); // e.g. "00" -> 0

				// Set the time
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

	private async mapRestaurantsToDatabaseSchema(
		searchParams: SearchRestaurantsParams,
	): Promise<RestaurantFormatForDatabase[]> {
		try {
			const restaurantInfo: YelpSearchResponse =
				await this.yelpClient.getRestaurantsFromYelpAPI(searchParams);
			const mappedRestaurants: RestaurantFormatForDatabase[] =
				restaurantInfo.businesses.map((restaurant: YelpBusiness) => {
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
				});

			return mappedRestaurants;
		} catch (error: any) {
			throw new YelpApiError(
				"Error mapping restaurants to database schema",
				error.status,
			);
		}
	}

	async saveRestaurantsToDatabase(
		restaurants: RestaurantFormatForDatabase[],
	): Promise<void> {
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
						update: {
							store_name: restaurant.store_name,
							country: restaurant.country,
							country_code: restaurant.country_code,
							city: restaurant.city,
							date: restaurant.date,
							restaurant_opened_at: restaurant.restaurant_opened_at,
							menu_available: restaurant.menu_available,
							restaurant_online: restaurant.restaurant_online,
							restaurant_offline: restaurant.restaurant_offline,
						},
						create: {
							store_name: restaurant.store_name,
							external_store_id: restaurant.external_store_id,
							country: restaurant.country,
							country_code: restaurant.country_code,
							city: restaurant.city,
							date: restaurant.date,
							restaurant_opened_at: restaurant.restaurant_opened_at,
							menu_available: restaurant.menu_available,
							restaurant_online: restaurant.restaurant_online,
							restaurant_offline: restaurant.restaurant_offline,
						},
					});
				}
			});
		} catch (error: any) {
			throw new DatabaseError("Failed to save restaurants to database", error);
		}
	}

	async syncRestaurantsWithDatabase(searchParams: SearchRestaurantsParams) {
		try {
			// 1. Map restaurants to database schema
			const mappedRestaurants =
				await this.mapRestaurantsToDatabaseSchema(searchParams);

			// 2. Save to database
			await this.saveRestaurantsToDatabase(mappedRestaurants);

			// 3. Return confirmation
			return {
				success: true,
				message: `Successfully synced ${mappedRestaurants.length} restaurants`,
				count: mappedRestaurants.length,
			};
		} catch (error: any) {
			if (error instanceof YelpApiError) {
				throw error;
			}
			if (error instanceof DatabaseError) {
				throw error;
			}
			throw new Error(`Failed to sync restaurants: ${error.message}`);
		}
	}
}
