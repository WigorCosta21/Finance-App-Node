import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/index.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'

describe('PostgresGetUserBalanceRepository', () => {
    const from = '2020-01-01'
    const to = '2030-12-31'
    let createdUser: Awaited<ReturnType<typeof prisma.user.create>>

    beforeEach(async () => {
        const user = makeUserParams()
        createdUser = await prisma.user.create({ data: user })
    })

    it('should get user balance on db', async () => {
        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.commerce.productName(),
                    amount: 5000,
                    type: 'EARNING',
                    date: new Date('2025-06-15'),
                    user_id: createdUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 5000,
                    type: 'EARNING',
                    date: new Date('2025-06-15'),
                    user_id: createdUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 1000,
                    type: 'EXPENSE',
                    date: new Date('2025-06-15'),
                    user_id: createdUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 1000,
                    type: 'EXPENSE',
                    date: new Date('2025-06-15'),
                    user_id: createdUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 3000,
                    type: 'INVESTMENT',
                    date: new Date('2025-06-15'),
                    user_id: createdUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 3000,
                    type: 'INVESTMENT',
                    date: new Date('2025-06-15'),
                    user_id: createdUser.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(createdUser.id, from, to)

        expect(result.earnings).toBe(10000)
        expect(result.expenses).toBe(2000)
        expect(result.investments).toBe(6000)
        expect(result.balance).toBe(2000)
    })

    it('should return 0 when transaction type exists but amount is null', async () => {
        await prisma.transaction.create({
            data: {
                name: faker.commerce.productName(),
                amount: 0,
                type: 'INVESTMENT',
                date: new Date('2025-06-15'),
                user_id: createdUser.id,
            },
        })

        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(createdUser.id, from, to)

        expect(result.investments).toBe(0)
        expect(result.earnings).toBe(0)
        expect(result.expenses).toBe(0)
        expect(result.balance).toBe(0)
    })

    it('should only include transactions within date range', async () => {
        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.commerce.productName(),
                    amount: 5000,
                    type: 'EARNING',
                    date: new Date('2025-06-15'),
                    user_id: createdUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 9999,
                    type: 'EARNING',
                    date: new Date('2019-01-01'), // antes do range
                    user_id: createdUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 9999,
                    type: 'EARNING',
                    date: new Date('2031-01-01'), // depois do range
                    user_id: createdUser.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(createdUser.id, from, to)

        expect(result.earnings).toBe(5000)
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        jest.spyOn(prisma.transaction, 'groupBy').mockRejectedValueOnce(
            new Error(),
        )

        await expect(sut.execute(createdUser.id, from, to)).rejects.toThrow()
    })
})
