import type { Request } from 'express'
import { faker } from '@faker-js/faker'
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

    const makeHttpRequst = (userId?: string) => {
        return {
            params: {
                userId: userId ?? faker.string.uuid(),
            },
        } as Request<UserIdParams>
    }

    it('should return 200 when getting user balance', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.execute(makeHttpRequst())

        expect(httpResponse.statusCode).toBe(200)
    })

    it('shound return 400 when userId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(makeHttpRequst('invalid_id'))

        expect(result.statusCode).toBe(400)
    })
})
