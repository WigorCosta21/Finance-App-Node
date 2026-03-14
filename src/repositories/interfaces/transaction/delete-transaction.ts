import type { Transaction } from '../../../types/transaction.js'

export interface IDeleteTransactionRepository {
    execute(transactionId: string): Promise<Transaction | null>
}
