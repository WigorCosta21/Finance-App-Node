import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { GetUserByIdUseCase } from './get-user-by-id.js'

describe('GetUserByIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return { sut, getUserByIdRepository }
    }

    it('should getUserByIdUseCase successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(user.id)

        expect(result).toEqual(user)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should throws if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})
