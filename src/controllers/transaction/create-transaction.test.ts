import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import type {
    CreateTransactionBody,
    CreateTransactionParams,
    Transaction,
} from '../../types/transaction.js'
import { CreateTransactionController } from './create-transaction.js'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(
            transaction: CreateTransactionParams,
        ): Promise<Transaction> {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: transaction.user_id,
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
            }
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()

        const sut = new CreateTransactionController(createTransactionUseCase)

        return { createTransactionUseCase, sut }
    }

    const makeHttpRequestBody = (body?: Partial<CreateTransactionBody>) => {
        return {
            body: {
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.recent().toISOString(),
                type: 'EARNING',
                amount: Number(faker.finance.amount()),
                ...body,
            },
        } as Request<unknown, unknown, CreateTransactionBody>
    }

    it('should return 201 when creating transaction', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(makeHttpRequestBody())

        expect(result.statusCode).toBe(201)
    })
})
