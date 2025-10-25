import 'dotenv/config'; // ensures .env is loaded
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!, // must not be empty
  },
  verbose: true,
  strict: true,
} satisfies Config;
