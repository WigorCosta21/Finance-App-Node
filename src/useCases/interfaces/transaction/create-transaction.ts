import type {
    CreateTransactionParams,
    Transaction,
} from '../../../types/transaction.js'

export interface ICreateTransactionUseCase {
    execute(
        createTransactionParams: CreateTransactionParams,
    ): Promise<Transaction>
}
