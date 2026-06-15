import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import {
    makeTransaction,
    makeUserParams,
} from '../../../tests/fixtures/index.js'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id.js'

describe('PostgresGetTransactionsByUserIdRepository', () => {
    const user = makeUserParams()
    const transaction = makeTransaction()
    const from = '2020-01-01'
    const to = '2030-12-31'

    it('should get transactions by user id and date range on db', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
                date: new Date(transaction.date),
            },
        })

        const result = await sut.execute(user.id, from, to)

        expect(result.length).toBe(1)
        expect(result[0]?.name).toBe(transaction.name)
        expect(result[0]?.type).toBe(transaction.type)
        expect(result[0]?.user_id).toBe(user.id)
        expect(result[0]?.amount).toBe(Number(transaction.amount))
        expect(result[0]?.date).toBe(
            new Date(transaction.date).toISOString().slice(0, 10),
        )
    })

    it('should call prisma with correct params', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')

        await sut.execute(user.id, from, to)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            orderBy: {
                date: 'desc',
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        jest.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id, from, to)

        await expect(promise).rejects.toThrow()
    })
})
