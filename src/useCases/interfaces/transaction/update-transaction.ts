import type {
    Transaction,
    UpdateTransactionParams,
} from '../../../types/transaction.js'

export interface IUpdateTransactionUseCase {
    execute(
        transactionId: string,
        updateTransactionParams: UpdateTransactionParams,
    ): Promise<Transaction | null>
}
