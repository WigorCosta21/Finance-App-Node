import 'dotenv/config'

import express, { type Request, type Response } from 'express'
import { CreateUserController } from './controllers/create-user.js'
import { GetUserByIdController } from './controllers/get-user-by-id.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request: Request, response: Response) => {
    const createUserController = new CreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

interface UserParams {
    userId: string
}

app.get(
    '/api/users/:userId',
    async (request: Request<UserParams>, response: Response) => {
        const getUserByIDController = new GetUserByIdController()

        const { statusCode, body } =
            await getUserByIDController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
