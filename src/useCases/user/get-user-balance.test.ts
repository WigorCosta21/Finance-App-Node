import { jest } from '@jest/globals'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import type { PublicUser } from '../../types/user.js'
import { makeBalance, makeUser } from '../../tests/fixtures/index.js'

describe('GetUserBalanceUseCase', () => {
    const userBalance = makeUser()
    const balance = makeBalance()
    const from = '2020-01-01'
    const to = '2030-12-31'

    class GetUserBalanceRepositoryStub {
        async execute(_userId: string, _from: string, _to: string) {
            return balance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(): Promise<PublicUser | null> {
            return userBalance
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return { sut, getUserBalanceRepository, getUserByIdRepository }
    }

    it('should get user balance successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(userBalance.id, from, to)

        expect(result).toEqual(balance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(userBalance.id, from, to)

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(userBalance.id, from, to)

        expect(executeSpy).toHaveBeenCalledWith(userBalance.id)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        const { sut, getUserBalanceRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')

        await sut.execute(userBalance.id, from, to)

        expect(executeSpy).toHaveBeenCalledWith(userBalance.id, from, to)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(userBalance.id, from, to)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        const { sut, getUserBalanceRepository } = makeSut()
        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(userBalance.id, from, to)

        await expect(promise).rejects.toThrow()
    })
})
