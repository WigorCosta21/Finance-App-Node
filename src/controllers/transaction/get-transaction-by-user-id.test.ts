// src/controllers/transaction/get-transactions-by-user-id.test.ts
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type { Transaction } from '../../types/transaction.js'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { makeTransaction } from '../../tests/fixtures/index.js'

describe('GetTransactionsByUserIdController', () => {
    const transaction = makeTransaction()

    class GetTransactionsByUserIdUseCaseStub {
        async execute(
            _userId: string,
            _from: string,
            _to: string,
        ): Promise<Transaction[] | null> {
            return [transaction]
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        )
        return { sut, getTransactionsByUserIdUseCase }
    }

    const validQuery = { from: '2020-01-01', to: '2030-12-31' }

    it('should return 200 when finding transactions by user id successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(faker.string.uuid(), validQuery)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when from is missing', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(faker.string.uuid(), {
            // @ts-expect-error testing missing field
            from: undefined,
            to: '2030-12-31',
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when to is missing', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(faker.string.uuid(), {
            from: '2020-01-01',
            // @ts-expect-error testing missing field
            to: undefined,
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when from date format is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(faker.string.uuid(), {
            from: 'invalid_date',
            to: '2030-12-31',
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when from is after to', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(faker.string.uuid(), {
            from: '2030-12-31',
            to: '2020-01-01',
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when use case throws UserNotFoundError', async () => {
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError())

        const response = await sut.execute(faker.string.uuid(), validQuery)

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when use case throws generic error', async () => {
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const response = await sut.execute(faker.string.uuid(), validQuery)

        expect(response.statusCode).toBe(500)
    })

    it('should call use case with correct params', async () => {
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionsByUserIdUseCase, 'execute')

        const userId = faker.string.uuid()
        await sut.execute(userId, validQuery)

        expect(executeSpy).toHaveBeenCalledWith(
            userId,
            validQuery.from,
            validQuery.to,
        )
    })
})
