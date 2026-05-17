import { UserNotFoundError } from '../../errors/user.js'
import type { ICreateTransactionRepository } from '../../repositories/interfaces/transaction/create-transaction.js'
import type { IGetUserByIdRepository } from '../../repositories/interfaces/user/get-user-by-id.js'
import type { CreateTransactionParams } from '../../types/transaction.js'
import type { IdGeneratorAdapter } from '../../adapters/index.js'
import type { ICreateTransactionUseCase } from '../interfaces/transaction/create-transaction.js'

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
    constructor(
        private createTransactionRepository: ICreateTransactionRepository,
        private getUserByIdRepository: IGetUserByIdRepository,
        private idGeneratorAdapter: IdGeneratorAdapter,
    ) {}

    async execute(createTransactionParams: CreateTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError()
        }

        const transactionId = this.idGeneratorAdapter.execute()

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
