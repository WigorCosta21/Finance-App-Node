import { prisma } from '../../../../prisma/prisma.js'
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
        const updatedTransactions = await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: updateTransactioParams,
        })

        return {
            ...updatedTransactions,
            amount: updatedTransactions.amount.toNumber(),
        }
    }
}
