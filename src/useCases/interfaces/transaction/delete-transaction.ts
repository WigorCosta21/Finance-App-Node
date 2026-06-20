import type { Transaction } from '../../../types/transaction.js'

export interface IDeleteTransactionUseCase {
    execute(transactionId: string, userId: string): Promise<Transaction | null>
}
