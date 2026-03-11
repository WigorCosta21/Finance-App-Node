import { UserNotFoundError } from '../../errors/user.js'
import type { IGetTransactionByUserIdRepository } from '../../repositories/interfaces/transaction/get-transactions-by-user-id.js'
import type { IGetUserByIdRepository } from '../../repositories/interfaces/user/get-user-by-id.js'
import type { Transaction } from '../../types/transaction.js'

export class GetTransactionsByUserIdUseCase {
    constructor(
        private getTransactionByUserIdRepository: IGetTransactionByUserIdRepository,
        private getUserByIdRepository: IGetUserByIdRepository,
    ) {}

    async execute(userId: string): Promise<Transaction[]> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transaction =
            await this.getTransactionByUserIdRepository.execute(userId)

        return transaction
    }
}
