import { YelpSearchResponse } from "./types";
import { YelpApiError } from "../../errors/custom-errors";
import { SearchRestaurantsParams } from "../../interfaces/gloabal-types";

export class YelpClient {
  constructor(private readonly apiKey: string = process.env.YELP_API_KEY!) {
    if (!apiKey) {
      throw new Error("Yelp API key is required");
    }
    this.apiKey = apiKey;
  }

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

  async getRestaurantsFromYelpAPI(
    filterParams: SearchRestaurantsParams,
  ): Promise<YelpSearchResponse> {
    try {
      const queryParams = this.formatFilterParams(filterParams);

      const response = await fetch(
        `${process.env.YELP_API_URL}/businesses/search?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error searching for restaurants:", error);
      throw new YelpApiError("Error searching for restaurants", error.status);
    }
  }
}
