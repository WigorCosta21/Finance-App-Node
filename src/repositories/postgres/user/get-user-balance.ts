import { prisma } from '../../../../prisma/prisma.js'
import type { IGetUserBalanceRepository } from '../../interfaces/user/get-user-balance.js'

export class PostgresGetUserBalanceRepository implements IGetUserBalanceRepository {
    async execute(userId: string, from: string, to: string) {
        const result = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                user_id: userId,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
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

        const total = total_earnings + total_expenses + total_investments

        const balance = total_earnings - total_expenses - total_investments

        const earningsPercentage =
            total === 0
                ? 0
                : Number(((total_earnings / total) * 100).toFixed(2))

        const expensesPercentage =
            total === 0
                ? 0
                : Number(((total_expenses / total) * 100).toFixed(2))

        const investmentsPercentage =
            total === 0
                ? 0
                : Number(((total_investments / total) * 100).toFixed(2))

        return {
            earnings: total_earnings,
            expenses: total_expenses,
            investments: total_investments,
            earningsPercentage,
            expensesPercentage,
            investmentsPercentage,
            balance,
        }
    }
}
