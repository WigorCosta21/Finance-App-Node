import { PostgresHelper } from '../../../db/postgres/helper.js'
import type { Transaction } from '../../../types/transaction.js'
import type { IDeleteTransactionRepository } from '../../interfaces/transaction/delete-transaction.js'

export class PostgresDeleteTransactionReposiroty implements IDeleteTransactionRepository {
    async execute(transactionId: string): Promise<Transaction | null> {
        const transaction = await PostgresHelper.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [transactionId],
        )

        return transaction[0] ?? null
    }
}
