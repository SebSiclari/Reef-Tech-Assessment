import type { YelpSearchResponse } from "./types";
import { YelpApiError } from "../../errors/custom-errors";
import type { SearchRestaurantsParams } from "../../interfaces/gloabal-types";

export class YelpClient {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  constructor(private readonly apiKey: string = process.env.YELP_API_KEY!) {
    if (!apiKey) {
      throw new Error("Yelp API key is required");
    }
    this.apiKey = apiKey;
  }

  /**
   * Formats the filter parameters for the Yelp API
   * @param {SearchRestaurantsParams} filterParams - The search parameters
   * @returns {string} - The formatted query parameters
   */
  private formatFilterParams(filterParams: SearchRestaurantsParams): string {
    const { location, term, categories, open_now, limit } = filterParams;
    const queryParams = new URLSearchParams({
      location,
      ...(term && { term }),
      ...(categories && { categories }),
      ...(open_now !== undefined && { open_now: open_now.toString() }),
      ...(limit && { limit: limit.toString() }),
    });
    return queryParams.toString();
  }

  /**
   * Fetches restaurants from the Yelp API
   * @param {SearchRestaurantsParams} filterParams - The search parameters
   * @returns {Promise<YelpSearchResponse>} - The restaurants
   */
  async getRestaurantsFromYelpAPI(filterParams: SearchRestaurantsParams): Promise<YelpSearchResponse> {
    try {
      const queryParams = this.formatFilterParams(filterParams);

      const response = await fetch(`${process.env.YELP_API_URL}/businesses/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error searching for restaurants:", error);
      throw new YelpApiError("Error searching for restaurants", error.status);
    }
  }
}
