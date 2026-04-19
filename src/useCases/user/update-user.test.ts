import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user.js'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class PasswordHasherAdapter {
        async execute() {
            return 'hashed_password'
        }
    }

    const makeSut = () => {
        const updateUserRepository = new UpdateUserRepositoryStub()
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapter()

        const sut = new UpdateUserUseCase(
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
        }
    }

    it('should UpdateUserUseCase successfully (without email and password', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
        })

        expect(result).toBe(user)
    })
})
