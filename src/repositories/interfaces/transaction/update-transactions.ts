import type { Transaction } from '../../../types/transaction.js'

export interface IUpdateTransactionRepository {
    execute(
        transactionId: string,
        updateTransactionsParams: Transaction,
    ): Promise<Transaction | null>
}
