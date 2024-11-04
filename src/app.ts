import express, { json, urlencoded } from "express";
import cors from "cors";
import { FinancialsRouter } from "./routes/financials.route";
import { prismaClientSingleton } from "./utils/clients";
import { YelpClient } from "./thirdParty/yelp/client";
import { RestaurantService } from "./services/restaurant.service";

const app = express();
const financialsRouter = new FinancialsRouter(new RestaurantService(new YelpClient(), prismaClientSingleton));
// Middleware to parse JSON and URL-encoded data
app.use(urlencoded({ extended: true }));
app.use(json());

// Enable CORS
app.use(cors());


// Register routes
app.use("/api/v0", financialsRouter.getRouter());

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
