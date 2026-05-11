import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import {
    makeTransaction,
    makeUserParams,
} from '../../../tests/fixtures/index.js'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id.js'

describe('PostgresGetTransactionByUserIdRepository', () => {
    const user = makeUserParams()
    const transaction = makeTransaction()

    it('should get transaction by user id on db', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
                date: new Date(transaction.date),
            },
        })

        const result = await sut.execute(user.id)

        expect(result.length).toBe(1)
        expect(result[0]?.name).toBe(transaction.name)
        expect(result[0]?.type).toBe(transaction.type)
        expect(result[0]?.user_id).toBe(user.id)
        expect(result[0]?.amount).toBe(Number(transaction.amount))
        expect(new Date(result[0]!.date).toISOString().slice(0, 10)).toBe(
            new Date(transaction.date).toISOString().slice(0, 10),
        )
    })

    it('should call prisma with correnct params', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        const prismaSpy = jest
            .spyOn(prisma.transaction, 'findMany')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})
