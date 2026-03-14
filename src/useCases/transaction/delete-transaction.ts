import type { IDeleteTransactionRepository } from '../../repositories/interfaces/transaction/delete-transaction.js'

export class DeleteTransactionUseCase {
    constructor(
        private deleteTransactionRepository: IDeleteTransactionRepository,
    ) {}

    async execute(transactionId: string) {
        const deletedTransaction =
            this.deleteTransactionRepository.execute(transactionId)

        return deletedTransaction
    }
}
