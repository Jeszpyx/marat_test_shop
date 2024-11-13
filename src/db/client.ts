import { Client, Pool } from 'pg'
import { SETTINGS } from '../settings'

export const dbPool = new Pool({
  connectionString: SETTINGS.DATABASE_URL,
})