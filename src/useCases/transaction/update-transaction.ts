import type { IUpdateTransactionRepository } from '../../repositories/interfaces/transaction/update-transactions.js'
import type { UpdateTransactionParams } from '../../types/transaction.js'

export class UpdateTransactionUseCase {
    constructor(
        private updateTransactionRepository: IUpdateTransactionRepository,
    ) {}

    async execute(transactionId: string, params: UpdateTransactionParams) {
        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )

        return transaction
    }
}
