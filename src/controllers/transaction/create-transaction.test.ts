import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type {
    CreateTransactionParams,
    Transaction,
} from '../../types/transaction.js'
import { CreateTransactionController } from './create-transaction.js'
import { makeTransactionParams } from '../../tests/fixtures/index.js'

describe('CreateTransactionController', () => {
    const transaction = makeTransactionParams()

    class CreateTransactionUseCaseStub {
        async execute(): Promise<Transaction> {
            return {
                id: 'generated_id',
                ...transaction,
            }
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)
        return { createTransactionUseCase, sut }
    }

    const makeBody = (
        overrides?: Partial<Omit<CreateTransactionParams, 'user_id'>>,
    ) => {
        const { user_id: _user_id, ...rest } = transaction
        return { ...rest, ...overrides }
    }

    const userId = faker.string.uuid()

    it('should return 201 when creating transaction (expense)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(userId, makeBody({ type: 'EXPENSE' }))

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction (earning)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(userId, makeBody({ type: 'EARNING' }))

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction (investment)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            userId,
            makeBody({ type: 'INVESTMENT' }),
        )

        expect(result.statusCode).toBe(201)
    })

    it('should return 400 when missing name', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            userId,
            // @ts-expect-error testing missing field
            makeBody({ name: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            userId,
            // @ts-expect-error testing missing field
            makeBody({ date: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            userId,
            // @ts-expect-error testing missing field
            makeBody({ type: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            userId,
            // @ts-expect-error testing missing field
            makeBody({ amount: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            userId,
            makeBody({ date: 'invalid_date' }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            userId,
            // @ts-expect-error testing invalid type
            makeBody({ type: 'invalid_type' }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is not a valid currency', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            userId,
            // @ts-expect-error testing invalid amount
            makeBody({ amount: 'invalid_amount' }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 when CreateTransactionUseCase throws', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(userId, makeBody())

        expect(result.statusCode).toBe(500)
    })

    it('should call CreateTransactionUseCase with userId merged into params', async () => {
        const { sut, createTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

        const body = makeBody()
        await sut.execute(userId, body)

        expect(executeSpy).toHaveBeenCalledWith({
            ...body,
            user_id: userId,
        })
    })
})
