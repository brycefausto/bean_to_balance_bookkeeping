import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

type Env = {
  DATABASE_URL: string
}
export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    seed: `tsx ./prisma/seed.ts`,
  },
  engine: "classic",
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});
