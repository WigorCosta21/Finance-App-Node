import 'dotenv/config'

import express, { type Request, type Response } from 'express'
import { CreateUserController } from './controllers/create-user.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request: Request, response: Response) => {
    const createUserController = new CreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
