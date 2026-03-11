import type { Transaction } from '../../../types/transaction.js'

export interface IGetTransactionByUserIdRepository {
    execute(userId: string): Promise<Transaction[]>
}
