import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { Pool } from 'pg'

const rootEnvPath = path.resolve(process.cwd(), '..', '.env')
const backendEnvPath = path.resolve(process.cwd(), '.env')
const envPath = fs.existsSync(rootEnvPath) ? rootEnvPath : backendEnvPath

dotenv.config({ path: envPath })

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
})
