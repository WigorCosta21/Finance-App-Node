import type { Transaction } from '../../../types/transaction.js'

export interface IGetTransactionByUserIdUseCase {
    execute(transactionId: string): Promise<Transaction[] | null>
}
