import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { GetUserBalanceController } from './get-user-balance.js'
import type { UserBalance } from '../../types/user.js'
import type { IGetUserBalanceUseCase } from '../../useCases/interfaces/user/get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import { makeBalance } from '../../tests/fixtures/index.js'

describe('GetUserBalanceController', () => {
    const balance = makeBalance()

    class GetUserBalanceUseCaseStub implements IGetUserBalanceUseCase {
        async execute(_userId: string): Promise<UserBalance> {
            return balance
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)
        return { sut, getUserBalanceUseCase }
    }

    it('should return 200 when getting user balance', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.execute(faker.string.uuid())

        expect(httpResponse.statusCode).toBe(200)
    })

    it('should return 400 when userId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('invalid_id')

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(faker.string.uuid())

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserBalanceUseCase with correct params', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute')

        const userId = faker.string.uuid()
        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should return 404 if GetUserBalanceUseCase throws UserNotFoundError', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const response = await sut.execute(faker.string.uuid())

        expect(response.statusCode).toBe(404)
    })
})
