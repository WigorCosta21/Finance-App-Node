import { prisma } from '../../../../prisma/prisma.js'
import {
    makeTransaction,
    makeUserParams,
} from '../../../tests/fixtures/index.js'
import { PostgresCreateTransactionRepository } from './create-transaction.js'

describe('PostgresCreateTransactionRepository', () => {
    const transaction = makeTransaction()
    const fakerUser = makeUserParams()
    it('should create a trasaction on db', async () => {
        const user = await prisma.user.create({ data: fakerUser })
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
})
