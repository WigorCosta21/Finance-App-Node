import { ZodError } from 'zod'
import type { UpdateTransactionParams } from '../../types/transaction.js'
import type { IUpdateTransactionUseCase } from '../../useCases/interfaces/transaction/update-transaction.js'
import { updateTransactionSchema } from '../../schemas/transaction.js'
import { ForbiddenError, TransactionNotFoundError } from '../../errors/index.js'

import {
    transactionNotFoundRespose,
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    forbidden,
    ok,
    serverError,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(private updateTransactionUseCase: IUpdateTransactionUseCase) {}

    async execute(
        transactionId: string,
        userId: string,
        params: UpdateTransactionParams,
    ) {
        try {
            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.updateTransactionUseCase.execute(
                transactionId,
                userId,
                params,
            )

            return ok(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues.map((issue) => ({
                        field: issue.path.join('.') || 'body',
                        message:
                            issue.code === 'unrecognized_keys'
                                ? 'Some provided field is not allowed'
                                : issue.message,
                    })),
                })
            }

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundRespose()
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }

            console.error(error)
            return serverError()
        }
    }
}
