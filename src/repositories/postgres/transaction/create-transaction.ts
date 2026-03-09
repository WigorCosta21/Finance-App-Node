import { PostgresHelper } from '../../../db/postgres/helper.js'
import type {
    CreateTransactionRepositoryParams,
    Transaction,
} from '../../../types/transaction.js'
import type { ICreateTransactionRepository } from '../../interfaces/transaction/create-transaction.js'

export class PostgresCreateTransactionRepository implements ICreateTransactionRepository {
    async execute(
        createTransactionParams: CreateTransactionRepositoryParams,
    ): Promise<Transaction> {
        const createdTransaction = await PostgresHelper.query(
            'INSERT INTO transactions (id, user_id, name, date, amount, type)  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                createTransactionParams.id,
                createTransactionParams.user_id,
                createTransactionParams.name,
                createTransactionParams.date,
                createTransactionParams.amount,
                createTransactionParams.type,
            ],
        )

        return createdTransaction[0]
    }
}
