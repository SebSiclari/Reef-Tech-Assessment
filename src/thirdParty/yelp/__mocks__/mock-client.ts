import type { YelpSearchResponse } from "../types";
import type { SearchRestaurantsParams } from "../../../interfaces/gloabal-types";

export class MockYelpClient {
  async getRestaurantsFromYelpAPI(_filterParams: SearchRestaurantsParams): Promise<YelpSearchResponse> {
    return {
      businesses: [
        {
          id: "mock-1",
          name: "Test Restaurant 1",
          is_closed: false,
          location: {
            address1: "123 Test St",
            city: "New York",
            state: "NY",
            zip_code: "10001",
            country: "US",
            display_address: ["123 Test St", "New York, NY 10001"],
          },
        },
        {
          id: "mock-2",
          name: "Test Restaurant 2",
          is_closed: true,
          location: {
            address1: "456 Test Ave",
            city: "New York",
            state: "NY",
            zip_code: "10002",
            country: "US",
            display_address: ["456 Test Ave", "New York, NY 10002"],
          },
        },
      ],
      total: 2,
    };
  }
}
