import { Router } from 'express'
import { type Request, type Response } from 'express'
import type { UserIdParams } from '../types/user.js'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeLoginUserController,
    makeUpdateUserController,
} from '../factories/controllers/user.js'

export const usersRoutes = Router()

usersRoutes.get(
    '/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const getUserByIdController = makeGetUserByIdController()

        const { statusCode, body } =
            await getUserByIdController.execute(request)

        return response.status(statusCode).json(body)
    },
)

usersRoutes.get(
    '/:userId/balance',
    async (request: Request<UserIdParams>, response: Response) => {
        const getUserBalanceController = makeGetUserBalanceController()

        const { statusCode, body } =
            await getUserBalanceController.execute(request)

        return response.status(statusCode).json(body)
    },
)

usersRoutes.post('/', async (request: Request, response: Response) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

usersRoutes.patch(
    '/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const updateUserController = makeUpdateUserController()

        const { statusCode, body } = await updateUserController.execute(request)

        return response.status(statusCode).send(body)
    },
)

usersRoutes.delete(
    '/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const deleteUserController = makeDeleteUserController()

        const { statusCode, body } = await deleteUserController.execute(request)

        return response.status(statusCode).json(body)
    },
)

usersRoutes.post('/login', async (request: Request, response: Response) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(request)

    response.status(statusCode).send(body)
})
