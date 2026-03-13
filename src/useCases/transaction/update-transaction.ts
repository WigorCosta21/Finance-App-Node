import { UserNotFoundError } from '../../errors/user.js'
import type { IUpdateTransactionRepository } from '../../repositories/interfaces/transaction/update-transactions.js'
import type { IGetUserByIdRepository } from '../../repositories/interfaces/user/get-user-by-id.js'
import type { UpdateTransactionParams } from '../../types/transaction.js'

export class UpdateTransactionUseCase {
    constructor(
        private updateTransactionRepository: IUpdateTransactionRepository,
        private getUserByIdRepository: IGetUserByIdRepository,
    ) {}

    async execute(
        transactionId: string,
        userId: string,
        params: UpdateTransactionParams,
    ) {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )

        return transaction
    }
}
