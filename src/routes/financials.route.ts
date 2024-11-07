import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller";
import type { RestaurantService } from "../services/restaurant.service";
import { validateSearchParams } from "../midlelware/middleware";

export const registerFinancialsRoutes = (restaurantService: RestaurantService) => {
  const router = Router();
  const restaurantController = new RestaurantController(restaurantService);
  router.get("/financials", validateSearchParams, restaurantController.getFinancials);
  return router;
};
