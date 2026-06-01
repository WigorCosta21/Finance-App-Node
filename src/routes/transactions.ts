import { Router, type Request, type Response } from 'express'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactiosByUserIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transaction.js'
import type { TransactionIdParams } from '../types/transaction.js'
import { auth } from '../middlewares/auth.js'
import { unauthorized } from '../controllers/helpers/index.js'

export const transactionsRoutes = Router()

transactionsRoutes.get(
    '/',
    auth,
    async (request: Request, response: Response) => {
        if (!request.userId) {
            const { statusCode, body } = unauthorized()
            return response.status(statusCode).json(body)
        }

        const controller = makeGetTransactiosByUserIdController()
        const { statusCode, body } = await controller.execute(request.userId)

        return response.status(statusCode).json(body)
    },
)

// rota
transactionsRoutes.post(
    '/',
    auth,
    async (request: Request, response: Response) => {
        if (!request.userId) {
            const { statusCode, body } = unauthorized()
            return response.status(statusCode).json(body)
        }

        const createTransactionController = makeCreateTransactionController()
        const { statusCode, body } = await createTransactionController.execute(
            request.userId,
            request.body,
        )
        response.status(statusCode).json(body)
    },
)

transactionsRoutes.patch(
    '/:transactionId',
    auth,
    async (request: Request<TransactionIdParams>, response: Response) => {
        console.error('[PATCH] transactionId:', request.params.transactionId)
        console.error('[PATCH] userId from token:', request.userId)
        console.error('[PATCH] body:', request.body)

        if (!request.userId) {
            const { statusCode, body } = unauthorized()
            return response.status(statusCode).json(body)
        }

        const updateTransactionController = makeUpdateTransactionController()
        const { statusCode, body } = await updateTransactionController.execute(
            request.params.transactionId,
            request.userId,
            request.body,
        )

        console.error('[PATCH] returning:', statusCode, body)

        return response.status(statusCode).json(body)
    },
)
transactionsRoutes.delete(
    '/:transactionId',
    async (request: Request<TransactionIdParams>, response: Response) => {
        const deleteTransactionController = makeDeleteTransactionController()

        const { statusCode, body } =
            await deleteTransactionController.execute(request)

        return response.status(statusCode).json(body)
    },
)
