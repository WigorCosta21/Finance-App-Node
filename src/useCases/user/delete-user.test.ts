import { faker } from '@faker-js/faker'
import type { PublicUser } from '../../types/user.js'
import { DeleteUserUseCase } from './delete-user.js'

const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
}
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
})
