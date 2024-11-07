import { ValidationError } from "../errors/custom-errors";
import type { YelpBusiness } from "../thirdParty/yelp/types";

export function validateRestaurantFormatForDatabase(restaurant: YelpBusiness): void {
  if (!restaurant.name) {
    throw new ValidationError("Restaurant name is required", 400);
  }

  if (!restaurant.id) {
    throw new ValidationError("Restaurant external store id is required", 400);
  }

  if (!restaurant.location.country) {
    throw new ValidationError("Restaurant location country is required", 400);
  }

  if (!restaurant.location.city) {
    throw new ValidationError("Restaurant location city is required", 400);
  }

  if (typeof restaurant.is_closed !== "boolean") {
    throw new ValidationError("Restaurant is_closed status is required", 400);
  }
}
