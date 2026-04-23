import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type { Transaction } from '../../types/transaction.js'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import type { UserIdQuery } from '../../types/user.js'
import { UserNotFoundError } from '../../errors/user.js'
import { makeTransaction } from '../../tests/fixtures/index.js'

describe('GetTransactionByUserIdController', () => {
    const transaction = makeTransaction()
    class GetTransactionByUserIdUseCaseStub {
        async execute(): Promise<Transaction[] | null> {
            return [transaction]
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

    const makeInvalidHttpRequest = (query: unknown) => {
        return {
            query,
        } as unknown as Request<unknown, unknown, unknown, UserIdQuery>
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sub } = makeSut()

        const response = await sub.execute(makeHttpRequest())

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when missing userId params', async () => {
        const { sub } = makeSut()

        const response = await sub.execute(
            makeInvalidHttpRequest({
                userId: undefined,
            }),
        )

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
        const { sub, getTransactionByUserIdUseCase } = makeSut()

        jest.spyOn(
            getTransactionByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError('user_id_not_found'))

        const response = await sub.execute(makeHttpRequest())

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when GetUserByIdUseCase throws generic errors', async () => {
        const { sub, getTransactionByUserIdUseCase } = makeSut()

        jest.spyOn(
            getTransactionByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const response = await sub.execute(makeHttpRequest())

        expect(response.statusCode).toBe(500)
    })

    it('should call GetUserByIdUser with correct params', async () => {
        const { sub, getTransactionByUserIdUseCase } = makeSut()

        const executeSpy = jest.spyOn(getTransactionByUserIdUseCase, 'execute')

        const userId = faker.string.uuid()
        const httpRequest = makeHttpRequest(userId)

        await sub.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
