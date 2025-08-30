import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '../config'
import { LoggerService } from '../logger/logger.service'

const logger = new LoggerService()

if (!config.databaseUrl) {
  logger.error('DATABASE_URL environment variable is not defined')
  throw new Error('DATABASE_URL environment variable is not defined')
}

const pool = new Pool({
  connectionString: config.databaseUrl,
})

pool.on('error', err => {
  logger.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export const Db = drizzle({ client: pool })
