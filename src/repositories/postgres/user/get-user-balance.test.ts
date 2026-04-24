import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/index.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'

describe('PostgresGetUserBalanceRepository', () => {
    it('should get user balance on db ', async () => {
        const user = makeUserParams()
        const createUser = await prisma.user.create({ data: user })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.commerce.productName(),
                    amount: 5000,
                    type: 'EARNING',
                    date: faker.date.recent(),
                    user_id: createUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 5000,
                    type: 'EARNING',
                    date: faker.date.recent(),
                    user_id: createUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 1000,
                    type: 'EXPENSE',
                    date: faker.date.recent(),
                    user_id: createUser.id,
                },

                {
                    name: faker.commerce.productName(),
                    amount: 1000,
                    type: 'EXPENSE',
                    date: faker.date.recent(),
                    user_id: createUser.id,
                },

                {
                    name: faker.commerce.productName(),
                    amount: 3000,
                    type: 'INVESTMENT',
                    date: faker.date.recent(),
                    user_id: createUser.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 3000,
                    type: 'INVESTMENT',
                    date: faker.date.recent(),
                    user_id: createUser.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(createUser.id)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })
})
