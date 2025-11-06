import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from root .env file (if it exists)
// In production/Docker, env vars are provided by docker-compose or the environment
const envPath = resolve(__dirname, '../../../../.env')
if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
}
