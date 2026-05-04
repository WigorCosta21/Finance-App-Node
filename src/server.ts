import 'dotenv/config'

import express, { type Request, type Response } from 'express'
import type { UserIdQuery } from './types/user.js'
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
import { usersRoutes } from './routes/users.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRoutes)

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
