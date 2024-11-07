import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { prismaClientSingleton } from "../utils/clients";

describe("Financials Route", async () => {
  beforeEach(async () => {
    await prismaClientSingleton.restaurantData.createMany({
      data: [
        {
          store_name: "Test Restaurant 1",
          external_store_id: "test-123",
          country: "US",
          country_code: "US",
          city: "New York",
          date: new Date("2024-03-15"),
          restaurant_opened_at: new Date("2024-03-15T09:00:00Z"),
          menu_available: true,
          restaurant_online: true,
          restaurant_offline: false,
        },
        {
          store_name: "Test Restaurant 2",
          external_store_id: "test-456",
          country: "GB",
          country_code: "GB",
          city: "London",
          date: new Date("2024-03-15"),
          restaurant_opened_at: new Date("2024-03-15T08:00:00Z"),
          menu_available: true,
          restaurant_online: false,
          restaurant_offline: true,
        },
      ],
    });
  });

  afterEach(async () => {
    await prismaClientSingleton.restaurantData.deleteMany({
      where: {
        external_store_id: {
          in: ["test-123", "test-456"],
        },
      },
    });
  });

  await describe("GET /api/v0/financials", () => {
    it("should retrun a validation error when no filters are applied", async () => {
      const response = await fetch("http://localhost:3000/api/v0/financials");
      assert.equal(response.status, 400);
    });

    it("should filter restaurants by location", async () => {
      const response = await fetch("http://localhost:3000/api/v0/financials?location=New%20York");
      const data = await response.json();

      assert.equal(response.status, 200);
      assert.equal(data.data.length, 10);
      assert.equal(data.data[0].city, "New York");
    });

    it("should correctly apply pagination and filter by location", async () => {
      const response = await fetch("http://localhost:3000/api/v0/financials?location=New%20York&page=1&limit=10");
      const data = await response.json();

      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
      assert.equal(data.data.length, 10);
      assert.equal(data.success, true);
    });

    it("should handle invalid parameters", async () => {
      const response = await fetch("http://localhost:3000/api/v0/financials?location=New%20York&page=-1");
      assert.equal(response.status, 400);
    });

    it("should handle non-existent data", async () => {
      const response = await fetch("http://localhost:3000/api/v0/financials?country=FR");
      assert.equal(response.status, 400);
    });
  });
});
