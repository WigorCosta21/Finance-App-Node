import type { Transaction } from '../../../types/transaction.js'

export interface IGetTransactionByIdRepository {
    execute(transactionId: string): Promise<Transaction | null>
}
