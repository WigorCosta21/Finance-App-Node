import { prisma } from '../../../../prisma/prisma.js'
import type { Transaction } from '../../../types/transaction.js'
import type { IGetTransactionsByUserIdRepository } from '../../interfaces/transaction/get-transactions-by-user-id.js'

export class PostgresGetTransactionsByUserIdRepository implements IGetTransactionsByUserIdRepository {
    async execute(
        userId: string,
        from: string,
        to: string,
    ): Promise<Transaction[]> {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id: userId,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            orderBy: {
                date: 'desc',
            },
        })

        return transactions.map((transaction) => ({
            ...transaction,
            date: transaction.date.toISOString().slice(0, 10),
            amount: Number(transaction.amount),
        }))
    }
}
