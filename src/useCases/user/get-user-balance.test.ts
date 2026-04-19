import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import type { PublicUser } from '../../types/user.js'

describe('GetUserBalanceUseCase', () => {
    const userBalance = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
    }

    const balance = {
        balance: faker.number.int(),
        earnings: faker.number.int(),
        expenses: faker.number.int(),
        investments: faker.number.int(),
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
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

        const result = await sut.execute(userBalance.id)

        expect(result).toEqual(balance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(userBalance.id)

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(userBalance.id),
        )
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(userBalance.id)

        expect(executeSpy).toHaveBeenCalledWith(userBalance.id)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        const { sut, getUserBalanceRepository } = makeSut()

        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')

        await sut.execute(userBalance.id)

        expect(executeSpy).toHaveBeenCalledWith(userBalance.id)
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(userBalance.id)

        await expect(promise).rejects.toThrow()
    })
})
