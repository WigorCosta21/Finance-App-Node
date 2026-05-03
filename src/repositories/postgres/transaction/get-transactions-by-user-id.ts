import { prisma } from '../../../../prisma/prisma.js'
import type { Transaction } from '../../../types/transaction.js'
import type { IGetTransactionByUserIdRepository } from '../../interfaces/transaction/get-transactions-by-user-id.js'

export class PostgresGetTransactionsByUserIdRepository implements IGetTransactionByUserIdRepository {
    async execute(userId: string): Promise<Transaction[]> {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id: userId,
            },
        })

        return transactions.map((transaction) => ({
            ...transaction,
            amount: transaction.amount.toNumber(),
            date: transaction.date.toISOString(),
        }))
    }
}
