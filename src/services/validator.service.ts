import { ValidationError } from "../errors/custom-errors";
import { YelpBusiness } from "../thirdParty/yelp/types";
export class ValidatorService {
  static validateRestaurantFormatForDatabase(restaurant: YelpBusiness): void {
    if (!restaurant.name) {
      throw new ValidationError("Restaurant name is required");
    }

    if (!restaurant.id) {
      throw new ValidationError("Restaurant external store id is required");
    }

    if (!restaurant.location.country) {
      throw new ValidationError("Restaurant location country is required");
    }

    if (!restaurant.location.city) {
      throw new ValidationError("Restaurant location city is required");
    }

    if (!restaurant.is_closed && typeof restaurant.is_closed !== "boolean") {
      throw new ValidationError("Restaurant is_closed status is required");
    }
  }
}
