import {
    Post,
    Route,
    Tags,
    Body,
    Controller,
    Get,
    Query
  } from "tsoa" 
import { RestaurantController } from "../controllers/restaurant.controller";

@Route("reeftech/v0")
@Tags("ReefV0Financials")
export class ReefV0FinancialsController extends Controller {

    /**
     * Get financials for a given location, term, categories, open_now, and limit
     * @param location - The location to search for
     * @param term - The term to search for
     * @param categories - The categories to search for
     * @param open_now - Whether to search for open restaurants
     * @param limit - The maximum number of results to return
     * @returns A string of financials
     */
    @Get("financials")
    public async getFinancials(
        @Query() location: string,
        @Query() term: string,
        @Query() categories: string,
        @Query() open_now: boolean,
        @Query() limit: number
    ): Promise<string> {
        try {   
            const financials = await RestaurantController.getFinancials(location, term, categories, open_now, limit);
            return financials;
        } catch (error) {
            throw new Error(error);
        }
    }

}

