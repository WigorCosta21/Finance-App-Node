import { forbidden, ok, serverError } from '../helpers/http.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'
import { transactionNotFoundRespose } from '../helpers/transaction.js'
import type { IDeleteTransactionUseCase } from '../../useCases/interfaces/transaction/delete-transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { ForbiddenError } from '../../errors/user.js'

export class DeleteTransactionController {
    constructor(private deleteTransactionUseCase: IDeleteTransactionUseCase) {}

    async execute(transactionId: string, userId: string) {
        try {
            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const transaction = await this.deleteTransactionUseCase.execute(
                transactionId,
                userId,
            )

            return ok(transaction)
        } catch (error) {
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
