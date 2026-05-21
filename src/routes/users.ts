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
import { auth } from '../middlewares/auth.js'
import { unauthorized } from '../controllers/helpers/index.js'

export const usersRoutes = Router()

usersRoutes.get('/', auth, async (request: Request, response: Response) => {
    if (!request.userId) {
        const { statusCode, body } = unauthorized()

        return response.status(statusCode).json(body)
    }

    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(
        request.userId,
    )

    return response.status(statusCode).json(body)
})

usersRoutes.get(
    '/balance',
    auth,
    async (request: Request<UserIdParams>, response: Response) => {
        if (!request.userId) {
            return unauthorized()
        }

        const getUserBalanceController = makeGetUserBalanceController()

        const { statusCode, body } = await getUserBalanceController.execute(
            request.userId,
        )

        return response.status(statusCode).json(body)
    },
)

usersRoutes.post('/', async (request: Request, response: Response) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

usersRoutes.patch(
    '/',
    auth,
    async (request: Request<UserIdParams>, response: Response) => {
        if (!request.userId) {
            const { statusCode, body } = unauthorized()

            return response.status(statusCode).json(body)
        }

        const updateUserController = makeUpdateUserController()

        const { statusCode, body } = await updateUserController.execute(
            request.userId,
            request.body,
        )

        return response.status(statusCode).send(body)
    },
)

usersRoutes.delete(
    '/',
    auth,
    async (request: Request<UserIdParams>, response: Response) => {
        if (!request.userId) {
            const { statusCode, body } = unauthorized()

            return response.status(statusCode).json(body)
        }

        const deleteUserController = makeDeleteUserController()

        const { statusCode, body } = await deleteUserController.execute(
            request.userId,
        )

        return response.status(statusCode).json(body)
    },
)

usersRoutes.post('/login', async (request: Request, response: Response) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(request)

    response.status(statusCode).send(body)
})
