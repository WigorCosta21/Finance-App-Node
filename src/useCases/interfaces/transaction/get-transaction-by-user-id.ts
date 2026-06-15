import type { Transaction } from '../../../types/transaction.js'

export interface IGetTransactionByUserIdUseCase {
    execute(
        userId: string,
        from: string,
        to: string,
    ): Promise<Transaction[] | null>
}
