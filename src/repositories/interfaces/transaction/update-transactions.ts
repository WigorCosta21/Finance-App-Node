import type {
    Transaction,
    UpdateTransactionParams,
} from '../../../types/transaction.js'

export interface IUpdateTransactionRepository {
    execute(
        transactionId: string,
        updateTransactionsParams: UpdateTransactionParams,
    ): Promise<Transaction | null>
}
