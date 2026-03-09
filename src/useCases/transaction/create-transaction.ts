import { v4 as uuidv4 } from 'uuid'

import { UserNotFoundError } from '../../errors/user.js'
import type { ICreateTransactionRepository } from '../../repositories/interfaces/transaction/create-transaction.js'
import type { IGetUserByIdRepository } from '../../repositories/interfaces/user/get-user-by-id.js'
import type { CreateTransactionParams } from '../../types/transaction.js'

export class CreateTransactionUseCase {
    constructor(
        private createTransactionRepository: ICreateTransactionRepository,
        private getUserByIdRepository: IGetUserByIdRepository,
    ) {}

    async execute(createTransactionParams: CreateTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4()

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
