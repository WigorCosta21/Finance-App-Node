import { jest } from '@jest/globals'
import type { PublicUser } from '../../types/user.js'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { makeUser } from '../../tests/fixtures/index.js'

describe('GetTransactionsByUserIdUseCase', () => {
    const user = makeUser()
    const from = '2020-01-01'
    const to = '2030-12-31'

    class GetTransactionsByUserIdRepositoryStub {
        async execute(_userId: string, _from: string, _to: string) {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(): Promise<PublicUser | null> {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        }
    }

    it('should get transactions successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(user.id, from, to)

        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(user.id, from, to)

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(user.id, from, to)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(user.id)
    })

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const repositorySpy = jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        )

        await sut.execute(user.id, from, to)

        expect(repositorySpy).toHaveBeenCalledWith(user.id, from, to)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id, from, to)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetTransactionsByUserIdRepository throws', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id, from, to)

        await expect(promise).rejects.toThrow()
    })
})
