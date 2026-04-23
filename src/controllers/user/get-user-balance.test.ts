import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { GetUserBalanceController } from './get-user-balance.js'
import type { UserBalance, UserIdParams } from '../../types/user.js'
import type { IGetUserBalanceUseCase } from '../../useCases/interfaces/user/get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import { makeBalance } from '../../tests/fixtures/index.js'

describe('GetUserBalanceController', () => {
    const balance = makeBalance()
    class GetUserBalanceUseCaseStub implements IGetUserBalanceUseCase {
        async execute(): Promise<UserBalance> {
            return balance
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)

        return {
            sut,
            getUserBalanceUseCase,
        }
    }

    const makeHttpRequest = (userId?: string) => {
        return {
            params: {
                userId: userId ?? faker.string.uuid(),
            },
        } as Request<UserIdParams>
    }

    it('should return 200 when getting user balance', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.execute(makeHttpRequest())

        expect(httpResponse.statusCode).toBe(200)
    })

    it('shound return 400 when userId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(makeHttpRequest('invalid_id'))

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(makeHttpRequest())

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserBalanceUseCase with correct params', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()

        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute')

        const userId = faker.string.uuid()
        const httpResquest = makeHttpRequest(userId)

        await sut.execute(httpResquest)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should return 404 if GetUserBalanceUseCase throws UserNotFoundError', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()

        const userId = faker.string.uuid()

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(userId),
        )

        const response = await sut.execute(makeHttpRequest())

        expect(response.statusCode).toBe(404)
    })
})
