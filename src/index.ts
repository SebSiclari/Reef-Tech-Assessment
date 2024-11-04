import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { prismaClientSingleton } from "./utils/clients";

// Initialize database connection
prismaClientSingleton
  .$connect()
  .then(() => {
    console.log("Successfully connected to database");

    // Start the server after the database connection is established
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
