import  { Router } from 'express';
import  { RestaurantController } from '../controllers/restaurant.controller';
import  { RestaurantService } from '../services/restaurant.service';
import { validateSearchParams } from '../midlelware/middleware';
import type { RouteHandler } from '../types/route-handler';
import type { SearchRestaurantsParams } from '../interfaces/gloabal-types';


export class FinancialsRouter {
  private restaurantController: RestaurantController;

  constructor(private readonly router: Router = Router(), private readonly restaurantService: RestaurantService = new RestaurantService()) {
    this.restaurantController = new RestaurantController(this.restaurantService);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/financials', validateSearchParams, this.getFinancials as any);
  }

  private getFinancials: RouteHandler= async (req, res, next) => {
    try {
      const searchParams: SearchRestaurantsParams = {
        location: String(req.query.location),
        term: String(req.query.term),
        categories: String(req.query.categories),
        open_now: Boolean(req.query.open_now),
        limit: Number(req.query.limit),
      };

      const restaurants = await this.restaurantController.getRestaurants(searchParams);
      console.log(restaurants);
      res.status(200).json(restaurants);
    } catch (error) {
      next(error);
    }
  };

  public getRouter(): Router {
    return this.router;
  }
}
