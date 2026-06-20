import { TransactionNotFoundError } from '../../errors/transaction.js'
import { ForbiddenError } from '../../errors/user.js'
import type { IDeleteTransactionRepository } from '../../repositories/interfaces/transaction/delete-transaction.js'
import type { IGetTransactionByIdRepository } from '../../repositories/interfaces/transaction/get-transaction-by-id.js'
import type { IDeleteTransactionUseCase } from '../interfaces/transaction/delete-transaction.js'

export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
    constructor(
        private deleteTransactionRepository: IDeleteTransactionRepository,
        private getTransactionByIdRepository: IGetTransactionByIdRepository,
    ) {}

    async execute(transactionId: string, userId: string) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transaction.user_id !== userId) {
            throw new ForbiddenError()
        }

        const deletedTransaction =
            await this.deleteTransactionRepository.execute(transactionId)

        return deletedTransaction
    }
}
