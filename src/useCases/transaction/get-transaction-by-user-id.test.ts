import { jest } from '@jest/globals'
import type { PublicUser } from '../../types/user.js'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { makeUser } from '../../tests/fixtures/index.js'

describe('GetTransactionByUserIdUseCase', () => {
    const user = makeUser()

    class GetTransactionByIdUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUsetByIdRepositoryStub {
        async execute(): Promise<PublicUser | null> {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionByIdUserIdRepository =
            new GetTransactionByIdUserIdRepositoryStub()
        const getUsetByIdRepository = new GetUsetByIdRepositoryStub()

        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionByIdUserIdRepository,
            getUsetByIdRepository,
        )

        return {
            sut,
            getTransactionByIdUserIdRepository,
            getUsetByIdRepository,
        }
    }

    it('shout GetTransactionByUserId if successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(user.id)

        expect(result).toEqual([])
    })

    it('shout throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUsetByIdRepository } = makeSut()

        jest.spyOn(getUsetByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('shout call GetUserByIdRepository with correct params', async () => {
        const { sut, getUsetByIdRepository } = makeSut()

        const getUserByIdRepositorySpy = jest.spyOn(
            getUsetByIdRepository,
            'execute',
        )

        await sut.execute(user.id)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(user.id)
    })

    it('shout call GetTransactionByIdUserIdRepository with correct params', async () => {
        const { sut, getTransactionByIdUserIdRepository } = makeSut()

        const getTransactionByIdUserIdRepositorySpy = jest.spyOn(
            getTransactionByIdUserIdRepository,
            'execute',
        )

        await sut.execute(user.id)

        expect(getTransactionByIdUserIdRepositorySpy).toHaveBeenCalledWith(
            user.id,
        )
    })

    it('shout throw if GetUserByIdRepository throws', async () => {
        const { sut, getUsetByIdRepository } = makeSut()

        jest.spyOn(getUsetByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })

    it('shout throw if GetTransactionByUserIdRepository throws', async () => {
        const { sut, getTransactionByIdUserIdRepository } = makeSut()

        jest.spyOn(
            getTransactionByIdUserIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})
