import type { Request } from 'express'
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
                id: 'generared_id',
                ...transaction,
            }
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()

        const sut = new CreateTransactionController(createTransactionUseCase)

        return { createTransactionUseCase, sut }
    }

    const makeHttpRequest = (body: unknown) =>
        ({
            body,
        }) as Request<unknown, unknown, CreateTransactionParams>

    it('should return 201 when creating transaction (expense)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(makeHttpRequest(transaction))

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction (earning)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, type: 'EARNING' }),
        )

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction (investment)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, type: 'INVESTMENT' }),
        )

        expect(result.statusCode).toBe(201)
    })

    it('shound return 400 when missing user_id', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, user_id: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when missing name', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, name: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when missing date', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, date: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when missing type', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, type: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when missing amount', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, amount: undefined }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('shound return 400 when date is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, date: 'invalid_date' }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({ ...transaction, type: 'invalid_type' }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 400 when amount is not a valid currency', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...transaction,
                amount: 'invalid_amount',
            }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('shound return 500 when CreateTransactionUseCase throwns', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(makeHttpRequest(transaction))

        expect(result.statusCode).toBe(500)
    })

    it('should call CreateTransactionUseCase with correct params', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

        const body = transaction
        const httpRequest = makeHttpRequest(body)

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(body)
    })
})
