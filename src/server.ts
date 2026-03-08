import 'dotenv/config'

import express, { type Request, type Response } from 'express'
import {
    UpdateUserController,
    GetUserByIdController,
    CreateUserController,
    DeleteUserController,
} from './controllers/index.js'
import type { UserIdParams } from './types/user.js'

const app = express()

app.use(express.json())

app.get(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const getUserByIDController = new GetUserByIdController()

        const { statusCode, body } =
            await getUserByIDController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.post('/api/users', async (request: Request, response: Response) => {
    const createUserController = new CreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

app.patch(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const updateUserController = new UpdateUserController()

        const { statusCode, body } = await updateUserController.execute(request)

        return response.status(statusCode).send(body)
    },
)

app.delete(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const deleteUserController = new DeleteUserController()

        const { statusCode, body } = await deleteUserController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
