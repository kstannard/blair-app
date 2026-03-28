import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Session pooler (port 5432) for migrations - IPv4 compatible
    url: process.env["DIRECT_URL"]!,
  },
});
