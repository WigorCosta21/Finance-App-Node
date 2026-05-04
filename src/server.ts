import 'dotenv/config'

import express from 'express'
import { usersRoutes } from './routes/users.js'
import { transactionsRoutes } from './routes/transactions.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRoutes)
app.use('/api/transactions', transactionsRoutes)

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
