import type { Request } from 'express'
import { ZodError } from 'zod'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'
import type { UpdateTransactionParams } from '../../types/transaction.js'

import type { IUpdateTransactionUseCase } from '../../useCases/interfaces/transaction/update-transaction.js'
import { updateTransactionSchema } from '../../schemas/transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { transactionNotFoundRespose } from '../helpers/transaction.js'

export interface ITransactionIdParams {
    transactionId: string
}

export class UpdateTransactionController {
    constructor(private updateTransactionUseCase: IUpdateTransactionUseCase) {}

    async execute(
        httpRequest: Request<
            ITransactionIdParams,
            unknown,
            UpdateTransactionParams
        >,
    ) {
        try {
            const { transactionId } = httpRequest.params

            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.updateTransactionUseCase.execute(
                transactionId,
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

            console.log(error)
            return serverError()
        }
    }
}
