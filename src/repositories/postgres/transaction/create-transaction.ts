import { prisma } from '../../../../prisma/prisma.js'
import type {
    CreateTransactionRepositoryParams,
    Transaction,
} from '../../../types/transaction.js'
import type { ICreateTransactionRepository } from '../../interfaces/transaction/create-transaction.js'

export class PostgresCreateTransactionRepository implements ICreateTransactionRepository {
    async execute(
        createTransactionParams: CreateTransactionRepositoryParams,
    ): Promise<Transaction> {
        const createdTransaction = await prisma.transaction.create({
            data: {
                ...createTransactionParams,
                date: new Date(createTransactionParams.date),
            },
        })

        return {
            ...createdTransaction,
            amount: createdTransaction.amount.toNumber(),
            date: createdTransaction.date.toISOString(),
        }
    }
}
