import type { Transaction } from '../../../types/transaction.js'

export interface IGetTransactionsByUserIdRepository {
    execute(userId: string, from: string, to: string): Promise<Transaction[]>
}
