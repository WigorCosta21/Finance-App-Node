import { PostgresHelper } from '../../../db/postgres/helper.js'
import type {
    Transaction,
    UpdateTransactionParams,
} from '../../../types/transaction.js'
import type { IUpdateTransactionRepository } from '../../interfaces/transaction/update-transactions.js'

export class PostgresUpdateTransactionRepository implements IUpdateTransactionRepository {
    async execute(
        transactionId: string,
        updateTransactioParams: UpdateTransactionParams,
    ): Promise<Transaction | null> {
        const updateFields: string[] = []
        const updateValues: unknown[] = []

        Object.keys(updateTransactioParams).forEach((key) => {
            const value =
                updateTransactioParams[key as keyof UpdateTransactionParams]

            if (value !== undefined) {
                updateFields.push(`${key} = $${updateValues.length + 1}`)
                updateValues.push(value)
            }
        })

        updateValues.push(transactionId)

        const updateQuery = `
               UPDATE transactions
               SET ${updateFields.join(',')}
               WHERE id = $${updateValues.length}
               RETURNING *
           `

        const updatedTransactions = await PostgresHelper.query(
            updateQuery,
            updateValues,
        )

        return updatedTransactions[0] ?? null
    }
}
