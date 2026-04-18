import { faker } from '@faker-js/faker'
import type { CreateUserParams } from '../../types/user.js'
import { CreateUserUseCase } from './create-user.js'
describe('CreateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositotyStub {
        async execute(user: CreateUserParams) {
            return {
                id: '123',
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryEmail = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositotyStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            createUserRepository,
            getUserByEmailRepositoryEmail,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepositoryEmail,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    const makeHttpRequestBody = () => ({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    })

    it('should successfully create a user', async () => {
        const { sut } = makeSut()

        const createUser = await sut.execute(makeHttpRequestBody())

        expect(createUser).toBeTruthy()
    })
})
