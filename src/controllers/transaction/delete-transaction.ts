import type { Request } from 'express'
import type { DeleteTransactionUseCase } from '../../useCases/index.js'
import type { TransactionIdParams } from '../../types/transaction.js'
import { ok, serverError } from '../helpers/http.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'
import { transactionNotFoundRespose } from '../helpers/transaction.js'

export class DeleteTransactionController {
    constructor(private deleteTransactionUseCase: DeleteTransactionUseCase) {}

    async execute(httpRequest: Request<TransactionIdParams>) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const transaction = await this.deleteTransactionUseCase.execute(
                httpRequest.params.transactionId,
            )

            if (!transaction) {
                return transactionNotFoundRespose()
            }

            return ok(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
