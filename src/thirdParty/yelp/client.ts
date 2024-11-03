import { YelpSearchResponse } from "./types";
import { YelpApiError } from "../../errors/custom-errors";

interface SearchRestaurantsParams {
	location: string;
	term?: string;
	categories?: string;
	open_now?: boolean;
	limit?: number;
}

export class YelpClient {
	constructor(private readonly apiKey: string) {
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

	async searchRestaurants(
		filterParams: SearchRestaurantsParams,
	): Promise<YelpSearchResponse[]> {
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
			return data.businesses;
		} catch (error: any) {
			console.error("Error searching for restaurants:", error);
			throw new YelpApiError("Error searching for restaurants", error.status);
		}
	}
}
