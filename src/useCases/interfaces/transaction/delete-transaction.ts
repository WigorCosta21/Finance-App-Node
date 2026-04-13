import type { Transaction } from '../../../types/transaction.js'

export interface IDeleteTransactionUseCase {
    execute(transactionId: string): Promise<Transaction | null>
}
