import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import { makeTransaction } from '../../../tests/fixtures/transactions.js'
import { makeUserParams } from '../../../tests/fixtures/user.js'
import { PostgresDeleteTransactionReposiroty } from './delete-transaction.js'

describe('PostgresDeleteTransactionRepository', () => {
    const userFaker = makeUserParams()
    const transactionFaker = makeTransaction()

    it('should delete a transaction on db', async () => {
        const user = await prisma.user.create({
            data: userFaker,
        })

        const transaction = await prisma.transaction.create({
            data: {
                ...transactionFaker,
                user_id: user.id,
            },
        })

        const sut = new PostgresDeleteTransactionReposiroty()

        const result = await sut.execute(transaction.id)
        expect(result?.name).toBe(transaction.name)
        expect(result?.type).toBe(transaction.type)
        expect(result?.user_id).toBe(user.id)
        expect(result?.amount).toBe(transaction.amount.toNumber())
        expect(new Date(result!.date).toISOString().slice(0, 10)).toBe(
            new Date(transaction.date).toISOString().slice(0, 10),
        )
    })

    it('should call prisma with correnct params', async () => {
        const user = await prisma.user.create({
            data: userFaker,
        })

        const transaction = await prisma.transaction.create({
            data: {
                ...transactionFaker,
                user_id: user.id,
            },
        })
        const prismaSpy = jest.spyOn(prisma.transaction, 'delete')
        const sut = new PostgresDeleteTransactionReposiroty()

        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        })
    })
})
