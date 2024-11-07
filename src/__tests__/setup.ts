import { before, after } from "node:test";
import app from "../app";
import { config } from "dotenv";
import { prismaClientSingleton } from "../utils/clients";

// Load test environment variables
config({ path: ".env.test" });

let server: any;

before(async () => {
  // Setup test database
  await prismaClientSingleton.$connect();
  server = app.listen(3000);
});

after(async () => {
  // Cleanup
  await prismaClientSingleton.$disconnect();
  server.close();
});

export { server };
