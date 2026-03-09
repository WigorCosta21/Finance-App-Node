import 'dotenv/config'

import express, { type Request, type Response } from 'express'
import {
    UpdateUserController,
    GetUserByIdController,
    CreateUserController,
    DeleteUserController,
} from './controllers/index.js'
import type { UserIdParams } from './types/user.js'
import { GetUserByIdUseCase } from './useCases/get-user-by-id.js'
import { PostgresGetUserByIdRepository } from './repositories/postgres/get-user-by-id.js'
import { PostgresDeleteUserRepository } from './repositories/postgres/delete-user.js'
import { DeleteUserUseCase } from './useCases/delete-user.js'
import { PostgresCreateUserRepository } from './repositories/postgres/create-user.js'
import { CreateUserUseCase } from './useCases/create-user.js'
import { PostgresGetUserByEmailRepository } from './repositories/postgres/get-user-by-email.js'
import { PostgresUpdateUserRepository } from './repositories/postgres/update-user.js'
import { UpdateUserUseCase } from './useCases/update-user.js'

const app = express()

app.use(express.json())

app.get(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const getUserByIdRepository = new PostgresGetUserByIdRepository()

        const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

        const getUserByIdController = new GetUserByIdController(
            getUserByIdUseCase,
        )

        const { statusCode, body } =
            await getUserByIdController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.post('/api/users', async (request: Request, response: Response) => {
    const postgresCreateUserRepository = new PostgresCreateUserRepository()
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()

    const createUserUseCase = new CreateUserUseCase(
        postgresCreateUserRepository,
        postgresGetUserByEmailRepository,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

app.patch(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const updateUserRepository = new PostgresUpdateUserRepository()

        const getUserByEmail = new PostgresGetUserByEmailRepository()

        const updateUserUseCase = new UpdateUserUseCase(
            updateUserRepository,
            getUserByEmail,
        )

        const updateUserController = new UpdateUserController(updateUserUseCase)

        const { statusCode, body } = await updateUserController.execute(request)

        return response.status(statusCode).send(body)
    },
)

app.delete(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const deleteUserRepository = new PostgresDeleteUserRepository()

        const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

        const deleteUserController = new DeleteUserController(deleteUserUseCase)

        const { statusCode, body } = await deleteUserController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
