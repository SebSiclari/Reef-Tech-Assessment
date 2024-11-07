import { describe, it } from "node:test";
import assert from "node:assert";
import type { PrismaClient } from "@prisma/client";
import type { YelpClient } from "../thirdParty/yelp/client";
import { RestaurantService } from "../services/restaurant.service";
import { ValidationError } from "../errors/custom-errors";

describe("RestaurantService", async () => {
  const mockPrisma = {
    $transaction: async (fn: any) => fn(mockPrisma),
    restaurantData: {
      upsert: async () => ({ id: 1 }),
      findMany: async () => [],
    },
  } as unknown as PrismaClient;

  await describe("mapRestaurantsToDatabaseSchema", () => {
    it("should map a single restaurant correctly", async () => {
      const mockYelpClient = {
        getRestaurantsFromYelpAPI: async () => ({
          businesses: [
            {
              id: "test-123",
              name: "Test Restaurant",
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
          ],
          total: 1,
        }),
      } as unknown as YelpClient;

      const service = new RestaurantService(mockYelpClient, mockPrisma);
      const result = await service.mapRestaurantsToDatabaseSchema({ location: "New York" });

      assert.equal(result.length, 1);
      assert.deepStrictEqual(result[0], {
        store_name: "Test Restaurant",
        external_store_id: "test-123",
        country: "US",
        country_code: "US",
        city: "New York",
        date: result[0].date,
        restaurant_opened_at: result[0].restaurant_opened_at,
        menu_available: true,
        restaurant_online: true,
        restaurant_offline: false,
      });
    });

    it("should map multiple restaurants correctly", async () => {
      const mockYelpClient = {
        getRestaurantsFromYelpAPI: async () => ({
          businesses: [
            {
              id: "test-123",
              name: "Pizza Place",
              is_closed: false,
              location: {
                city: "New York",
                country: "US",
              },
            },
            {
              id: "test-456",
              name: "Burger Joint",
              is_closed: true,
              location: {
                city: "New York",
                country: "US",
              },
            },
          ],
          total: 2,
        }),
      } as unknown as YelpClient;

      const service = new RestaurantService(mockYelpClient, mockPrisma);
      const result = await service.mapRestaurantsToDatabaseSchema({ location: "New York" });

      assert.equal(result.length, 2);
      assert.equal(result[0].store_name, "Pizza Place");
      assert.equal(result[0].restaurant_online, true);
      assert.equal(result[1].store_name, "Burger Joint");
      assert.equal(result[1].restaurant_offline, true);
    });
  });

  await describe("mapRestaurantsToDatabaseSchema validation", () => {
    it("should throw ValidationError when restaurant name is missing", async () => {
      const mockYelpClient = {
        getRestaurantsFromYelpAPI: async () => ({
          businesses: [
            {
              id: "test-123",
              // name is missing
              is_closed: false,
              location: {
                city: "New York",
                country: "US",
              },
            },
          ],
          total: 1,
        }),
      } as unknown as YelpClient;

      const service = new RestaurantService(mockYelpClient, mockPrisma);

      await assert.rejects(
         () => service.mapRestaurantsToDatabaseSchema({ location: "New York" }),
        (err: any) => {
          assert.ok(err instanceof ValidationError);
          assert.equal(err.message, "Restaurant name is required");
          return true;
        },
      );
    });

    it("should throw ValidationError when restaurant ID is missing", async () => {
      const mockYelpClient = {
        getRestaurantsFromYelpAPI: async () => ({
          businesses: [
            {
              name: "Test Restaurant",
              // id is missing
              is_closed: false,
              location: {
                city: "New York",
                country: "US",
              },
            },
          ],
          total: 1,
        }),
      } as unknown as YelpClient;

      const service = new RestaurantService(mockYelpClient, mockPrisma);

      await assert.rejects(
        () => service.mapRestaurantsToDatabaseSchema({ location: "New York" }),
        (err: any) => {
          assert.ok(err instanceof ValidationError);
          assert.equal(err.message, "Restaurant external store id is required");
          return true;
        },
      );
    });

    it("should throw ValidationError when location city is missing", async () => {
      const mockYelpClient = {
        getRestaurantsFromYelpAPI: async () => ({
          businesses: [
            {
              id: "test-123",
              name: "Test Restaurant",
              is_closed: false,
              location: {
                country: "US",
                // city is missing
              },
            },
          ],
          total: 1,
        }),
      } as unknown as YelpClient;

      const service = new RestaurantService(mockYelpClient, mockPrisma);

      await assert.rejects(
        () => service.mapRestaurantsToDatabaseSchema({ location: "New York" }),
        (err: any) => {
          assert.ok(err instanceof ValidationError);
          assert.equal(err.message, "Restaurant location city is required");
          return true;
        },
      );
    });

    it("should throw ValidationError when location country is missing", async () => {
      const mockYelpClient = {
        getRestaurantsFromYelpAPI: async () => ({
          businesses: [
            {
              id: "test-123",
              name: "Test Restaurant",
              is_closed: false,
              location: {
                city: "New York",
                // country is missing
              },
            },
          ],
          total: 1,
        }),
      } as unknown as YelpClient;

      const service = new RestaurantService(mockYelpClient, mockPrisma);

      await assert.rejects(
        () => service.mapRestaurantsToDatabaseSchema({ location: "New York" }),
        (err: any) => {
          assert.ok(err instanceof ValidationError);
          assert.equal(err.message, "Restaurant location country is required");
          return true;
        },
      );
    });
  });
});
