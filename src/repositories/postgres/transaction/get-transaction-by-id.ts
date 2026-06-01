import { prisma } from '../../../../prisma/prisma.js'
import type { IGetTransactionByIdRepository } from '../../interfaces/transaction/get-transaction-by-id.js'

export class PostgresGetTransactionByIdRepository implements IGetTransactionByIdRepository {
    async execute(transactionId: string) {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId,
            },
        })

        if (!transaction) return null

        return {
            ...transaction,
            date: transaction.date.toISOString().slice(0, 10),
            amount: transaction.amount.toNumber(),
        }
    }
}
