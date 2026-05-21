import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { DeleteUserController } from './delete-user.js'
import type { PublicUser } from '../../types/user.js'
import { makeUser } from '../../tests/fixtures/index.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('DeleteUserController', () => {
    const user = makeUser()

    class DeleteUserUseCaseStub {
        async execute(_userId: string): Promise<PublicUser | null> {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub()
        const sut = new DeleteUserController(deleteUserUseCase)
        return { deleteUserUseCase, sut }
    }

    it('should return 200 if user is deleted', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('invalid_id')

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        const { sut, deleteUserUseCase } = makeSut()

        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const result = await sut.execute(faker.string.uuid())

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteUserUseCase throws', async () => {
        const { sut, deleteUserUseCase } = makeSut()

        jest.spyOn(deleteUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const result = await sut.execute(faker.string.uuid())

        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteUserUseCase with correct params', async () => {
        const { sut, deleteUserUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteUserUseCase, 'execute')

        const userId = faker.string.uuid()
        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
