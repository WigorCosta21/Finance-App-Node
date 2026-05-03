import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import { PostgresCreateTransactionRepository } from './create-transaction.js'
import {
    makeTransaction,
    makeUserParams,
} from '../../../tests/fixtures/index.js'

describe('PostgresCreateTransactionRepository', () => {
    const transaction = makeTransaction()
    const user = makeUserParams()
    it('should create a trasaction on db', async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({ ...transaction, user_id: user.id })

        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(result.amount).toBe(transaction.amount)
        expect(new Date(result.date).toISOString().slice(0, 10)).toBe(
            new Date(transaction.date).toISOString().slice(0, 10),
        )
    })

    it('should call prisma with correnct params', async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresCreateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'create')

        await sut.execute({ ...transaction, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            data: {
                ...transaction,
                user_id: user.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository()
        const prismaSpy = jest
            .spyOn(prisma.transaction, 'create')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow()
    })
})
