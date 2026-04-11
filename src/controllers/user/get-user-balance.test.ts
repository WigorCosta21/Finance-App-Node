import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { GetUserBalanceController } from './get-user-balance.js'
import type { UserBalance, UserIdParams } from '../../types/user.js'
import type { IGetUserBalanceUseCase } from '../../useCases/interfaces/user/get-user-balance.js'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub implements IGetUserBalanceUseCase {
        async execute(): Promise<UserBalance> {
            return {
                balance: faker.number.int(),
                earnings: faker.number.int(),
                expenses: faker.number.int(),
                investments: faker.number.int(),
            }
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
})
