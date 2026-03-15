import { prisma } from '../../../../prisma/prisma.js'
import type { IGetUserBalanceRepository } from '../../interfaces/user/get-user-balance.js'

export class PostgresGetUserBalanceRepository implements IGetUserBalanceRepository {
    async execute(userId: string) {
        const result = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                user_id: userId,
            },
            _sum: {
                amount: true,
            },
        })

        const total_expenses =
            result
                .find((item) => item.type === 'EXPENSE')
                ?._sum.amount?.toNumber() ?? 0

        const total_earnings =
            result
                .find((item) => item.type === 'EARNING')
                ?._sum.amount?.toNumber() ?? 0

        const total_investments =
            result
                .find((item) => item.type === 'INVESTMENT')
                ?._sum.amount?.toNumber() ?? 0

        const balance = total_earnings - total_expenses - total_investments

        return {
            earnings: total_earnings,
            expenses: total_expenses,
            investments: total_investments,
            balance,
        }
    }
}
