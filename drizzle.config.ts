import { defineConfig } from 'drizzle-kit'
import { config } from './src/config'

export default defineConfig({
  schema: ['./src/db/schemas/*.schema.ts', './src/db/enum/*.enum.ts'],
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl!,
  },
})
