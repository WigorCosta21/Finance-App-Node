import { prisma } from '../../../../prisma/prisma.js'
import { makeTransaction } from '../../../tests/fixtures/transactions.js'
import { makeUserParams } from '../../../tests/fixtures/user.js'
import { PostgresDeleteTransactionReposiroty } from './delete-transaction.js'

describe('PostgresDeleteTransactionRepository', () => {
    it('should delete a transaction on db', async () => {
        const userFaker = makeUserParams()

        const user = await prisma.user.create({
            data: userFaker,
        })

        const transactionFaker = makeTransaction()

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
})
