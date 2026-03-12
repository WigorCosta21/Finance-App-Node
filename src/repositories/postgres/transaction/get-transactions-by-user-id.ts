import { PostgresHelper } from '../../../db/postgres/helper.js'
import type { Transaction } from '../../../types/transaction.js'
import type { IGetTransactionByUserIdRepository } from '../../interfaces/transaction/get-transactions-by-user-id.js'

export class PostgresGetTransactionsByUserIdRepository implements IGetTransactionByUserIdRepository {
    async execute(userId: string): Promise<Transaction[]> {
        const transactions = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId],
        )

        return transactions
    }
}
