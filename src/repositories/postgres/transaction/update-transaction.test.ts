import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import {
    makeTransaction,
    makeUserParams,
} from '../../../tests/fixtures/index.js'
import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { TransactionType } from '../../../../generated/prisma/enums.js'

describe('PostgresUpdateTransactionRepository', () => {
    const user = makeUserParams()
    const transaction = makeTransaction()

    it('shoul update a transaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
            },
        })

        const sut = new PostgresUpdateTransactionRepository()

        const params = {
            id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: faker.number.int({
                min: 100,
                max: 10000,
            }),
            type: TransactionType.EARNING,
        }

        const result = await sut.execute(transaction.id, params)

        expect(result?.id).toBe(params.id)
        expect(result?.name).toBe(params.name)
        expect(result?.type).toBe(params.type)
        expect(result?.user_id).toBe(user.id)
        expect(result?.amount).toBe(params.amount)
        expect(new Date(result!.date).toISOString().slice(0, 10)).toBe(
            new Date(params.date).toISOString().slice(0, 10),
        )
    })

    it('should call prisma with correnct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'update')

        await sut.execute(transaction.id, {
            name: transaction.name,
            date: transaction.date,
            amount: transaction.amount,
            type: transaction.type,
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: {
                name: transaction.name,
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
            },
        })
    })
})
