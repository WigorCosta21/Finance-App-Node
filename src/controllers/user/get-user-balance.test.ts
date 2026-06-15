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
        async execute(
            _userId: string,
            _from: string,
            _to: string,
        ): Promise<UserBalance> {
            return balance
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)
        return { sut, getUserBalanceUseCase }
    }

    const validQuery = { from: '2020-01-01', to: '2030-12-31' }

    it('should return 200 when getting user balance', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.execute(faker.string.uuid(), validQuery)

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual(balance)
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

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(faker.string.uuid(), validQuery)

        expect(result.statusCode).toBe(500)
    })

    it('should return 404 if GetUserBalanceUseCase throws UserNotFoundError', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const response = await sut.execute(faker.string.uuid(), validQuery)

        expect(response.statusCode).toBe(404)
    })

    it('should call GetUserBalanceUseCase with correct params', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute')

        const userId = faker.string.uuid()
        await sut.execute(userId, validQuery)

        expect(executeSpy).toHaveBeenCalledWith(
            userId,
            validQuery.from,
            validQuery.to,
        )
    })
})
