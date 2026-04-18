import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type { CreateUserParams, PublicUser } from '../../types/user.js'
import { CreateUserUseCase } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
describe('CreateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute(): Promise<PublicUser | null> {
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

    it('should throws an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRepositoryEmail } = makeSut()

        const user = makeHttpRequestBody()

        const existingUser: PublicUser = {
            id: faker.string.uuid(),
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        }

        jest.spyOn(
            getUserByEmailRepositoryEmail,
            'execute',
        ).mockResolvedValueOnce(existingUser)

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })
})
