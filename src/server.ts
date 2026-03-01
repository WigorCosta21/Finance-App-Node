import 'dotenv/config'

import express from 'express'
import { PostgresHelper } from './db/postgres/helper.js'

const app = express()

app.get('/', async (req, res) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')

    res.json(results)
})

app.listen(3000, () => console.log('Server is running'))
