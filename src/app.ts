import 'dotenv/config'

import express from 'express'
import { usersRoutes } from './routes/users.js'
import { transactionsRoutes } from './routes/transactions.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRoutes)
app.use('/api/transactions', transactionsRoutes)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf-8'),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
