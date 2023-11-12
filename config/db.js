import dotenv from 'dotenv'
import { createPool } from 'mysql2/promise'

dotenv.config()
export const connection = createPool(
    process.env.MYSQL_URL
)