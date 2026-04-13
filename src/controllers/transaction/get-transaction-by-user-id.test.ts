import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import type { Transaction } from '../../types/transaction.js'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import type { UserIdQuery } from '../../types/user.js'

describe('GetTransactionByUserIdController', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute(): Promise<Transaction | null> {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime.toString(),
                amount: Number(faker.finance.amount()),
                type: 'EARNING',
            }
        }
    }

    const makeSut = () => {
        const getTransactionByUserIdUseCase =
            new GetTransactionByUserIdUseCaseStub()

        const sub = new GetTransactionsByUserIdController(
            getTransactionByUserIdUseCase,
        )

        return { sub, getTransactionByUserIdUseCase }
    }

    const makeHttpRequest = (userId?: string) => {
        return {
            query: {
                userId: userId ?? faker.string.uuid(),
            },
        } as Request<unknown, unknown, unknown, UserIdQuery>
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sub } = makeSut()

        const response = await sub.execute(makeHttpRequest())

        expect(response.statusCode).toBe(200)
    })
})
