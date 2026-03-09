import type {
    CreateTransactionRepositoryParams,
    Transaction,
} from '../../../types/transaction.js'

export interface ICreateTransactionRepository {
    execute(
        createTransactionParams: CreateTransactionRepositoryParams,
    ): Promise<Transaction>
}
