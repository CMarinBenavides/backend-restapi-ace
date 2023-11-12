
import { createPool } from 'mysql2/promise'

import { MYSQL_URL } from './config.js'

export const connection = createPool(
    MYSQL_URL
)