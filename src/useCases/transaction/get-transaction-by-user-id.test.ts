import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type { PublicUser, User } from '../../types/user.js'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
describe('GetTransactionByUserIdUseCase', () => {
    const user: User = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

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

        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })

    it('shout call GetUserByIdRepository with correct params', async () => {
        const { sut, getUsetByIdRepository } = makeSut()

        const getUserByIdRepositorySpy = jest.spyOn(
            getUsetByIdRepository,
            'execute',
        )

        sut.execute(user.id)

        await expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(user.id)
    })
})
