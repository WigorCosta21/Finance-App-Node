import { prisma } from '../../../../prisma/prisma.js'
import type { Transaction } from '../../../types/transaction.js'
import type { IDeleteTransactionRepository } from '../../interfaces/transaction/delete-transaction.js'

export class PostgresDeleteTransactionReposiroty implements IDeleteTransactionRepository {
    async execute(transactionId: string): Promise<Transaction | null> {
        try {
            const transaction = await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
            })

            return {
                ...transaction,
                amount: transaction.amount.toNumber(),
                date: transaction.date.toISOString(),
            }
        } catch {
            return null
        }
    }
}
