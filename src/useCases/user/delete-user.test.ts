import { jest } from '@jest/globals'
import type { PublicUser } from '../../types/user.js'
import { DeleteUserUseCase } from './delete-user.js'
import { makeUser } from '../../tests/fixtures/index.js'

const user = makeUser()
describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute(): Promise<PublicUser | null> {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()

        const sut = new DeleteUserUseCase(deleteUserRepository)

        return { deleteUserRepository, sut }
    }

    it('should successfully delete a user', async () => {
        const { sut } = makeSut()

        const deletedUser = await sut.execute(user.id)

        expect(deletedUser).toEqual(user)
    })

    it('should call DeleteUserRepository with correct params', async () => {
        const { sut, deleteUserRepository } = makeSut()

        const executeSpy = jest.spyOn(deleteUserRepository, 'execute')
        const userId = user.id

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepository } = makeSut()
        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})
