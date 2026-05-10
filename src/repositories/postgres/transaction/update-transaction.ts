import { prisma } from '../../../../prisma/prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import type {
    Transaction,
    UpdateTransactionParams,
} from '../../../types/transaction.js'
import type { IUpdateTransactionRepository } from '../../interfaces/transaction/update-transactions.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresUpdateTransactionRepository implements IUpdateTransactionRepository {
    async execute(
        transactionId: string,
        updateTransactioParams: UpdateTransactionParams,
    ): Promise<Transaction | null> {
        try {
            const updatedTransactions = await prisma.transaction.update({
                where: {
                    id: transactionId,
                },
                data: updateTransactioParams,
            })

            return {
                ...updatedTransactions,
                amount: updatedTransactions.amount.toNumber(),
                date: updatedTransactions.date.toISOString(),
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
