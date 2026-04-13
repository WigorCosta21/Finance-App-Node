import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import type {
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
                name: transaction.name,
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

    const makeHttpRequestBody = () => {
        return {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: 'EARNING',
            amount: Number(faker.finance.amount()),
        }
    }

    const makeHttpRequest = (body: unknown) =>
        ({
            body,
        }) as Request<unknown, unknown, CreateTransactionParams>

    it('should return 201 when creating transaction (expense)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(makeHttpRequest(makeHttpRequestBody()))

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction (earning)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), type: 'EARNING' }),
        )

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction (investment)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), type: 'INVESTMENT' }),
        )

        expect(result.statusCode).toBe(201)
    })

    it('shound return 400 when missing user_id', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), user_id: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when missing name', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), name: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when missing date', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), date: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when missing type', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), type: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when missing amount', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), amount: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('shound return 400 when date is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), date: 'invalid_date' }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...makeHttpRequestBody(), type: 'invalid_type' }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when amount is not a valid currency', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...makeHttpRequestBody(),
                amount: 'invalid_amount',
            }),
        )

        expect(result.statusCode).toBe(400)
    })
})
