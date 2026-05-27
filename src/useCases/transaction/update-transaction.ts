import { ForbiddenError } from '../../errors/user.js'
import type { IGetTransactionByIdRepository } from '../../repositories/interfaces/transaction/get-transaction-by-id.js'
import type { IUpdateTransactionRepository } from '../../repositories/interfaces/transaction/update-transactions.js'
import type { UpdateTransactionParams } from '../../types/transaction.js'
import type { IUpdateTransactionUseCase } from '../interfaces/transaction/update-transaction.js'

export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
    constructor(
        private updateTransactionRepository: IUpdateTransactionRepository,
        private getTransactionByIdRepository: IGetTransactionByIdRepository,
    ) {}

    async execute(
        transactionId: string,
        userId: string,
        params: UpdateTransactionParams,
    ) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (transaction?.user_id !== userId) {
            throw new ForbiddenError()
        }

        return await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )
    }
}
