import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { GetUserByIdController } from './get-user-by-id.js'
import type { PublicUser } from '../../types/user.js'
import { makeUser } from '../../tests/fixtures/user.js'

describe('GetUserByIdController', () => {
    const user = makeUser()

    class GetUserByIdUseCaseStub {
        async execute(_userId: string): Promise<PublicUser | null> {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)
        return { getUserByIdUseCase, sut }
    }

    it('should return 200 if a user is found', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if an invalid id is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('invalid_id')

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if a user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)

        const result = await sut.execute(faker.string.uuid())

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws an error', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(faker.string.uuid())

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        const userId = faker.string.uuid()
        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
