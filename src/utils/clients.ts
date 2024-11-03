import { PrismaClient } from "@prisma/client";
import { YelpClient } from "../thirdParty/yelp/client";

export const prismaClientSingleton = new PrismaClient();
export const yelpClientSingleton = new YelpClient();
