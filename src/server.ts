import 'dotenv/config'

import express, { type Request, type Response } from 'express'
import type { UserIdParams, UserIdQuery } from './types/user.js'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './factories/controllers/user.js'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactiosByUserIdController,
    makeUpdateTransactionController,
} from './factories/controllers/transaction.js'
import type { ITransactionIdParams } from './controllers/index.js'
import type {
    TransactionIdParams,
    UpdateTransactionParams,
} from './types/transaction.js'

const app = express()

app.use(express.json())

app.get(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const getUserByIdController = makeGetUserByIdController()

        const { statusCode, body } =
            await getUserByIdController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.post('/api/users', async (request: Request, response: Response) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

app.patch(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const updateUserController = makeUpdateUserController()

        const { statusCode, body } = await updateUserController.execute(request)

        return response.status(statusCode).send(body)
    },
)

app.delete(
    '/api/users/:userId',
    async (request: Request<UserIdParams>, response: Response) => {
        const deleteUserController = makeDeleteUserController()

        const { statusCode, body } = await deleteUserController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.get(
    '/api/transactions',
    async (
        request: Request<unknown, unknown, unknown, UserIdQuery>,
        response: Response,
    ) => {
        const getTransactionsByUserIdController =
            makeGetTransactiosByUserIdController()

        const { statusCode, body } =
            await getTransactionsByUserIdController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.post('/api/transactions', async (request: Request, response: Response) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } =
        await createTransactionController.execute(request)

    response.status(statusCode).json(body)
})

app.patch(
    '/api/transactions/:transactionId',
    async (
        request: Request<
            ITransactionIdParams,
            unknown,
            UpdateTransactionParams
        >,
        response: Response,
    ) => {
        const updateTransactionController = makeUpdateTransactionController()

        const { statusCode, body } =
            await updateTransactionController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.delete(
    '/api/transaction/:transactionId',
    async (request: Request<TransactionIdParams>, response: Response) => {
        const deleteTransactionController = makeDeleteTransactionController()

        const { statusCode, body } =
            await deleteTransactionController.execute(request)

        return response.status(statusCode).json(body)
    },
)

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
