import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/index.js'
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
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                const code = error.code

                if (code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }

            throw new Error()
        }
    }
}
