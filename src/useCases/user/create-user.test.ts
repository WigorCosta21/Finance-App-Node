import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type { CreateUserParams, PublicUser } from '../../types/user.js'
import { CreateUserUseCase } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { makeUserParams } from '../../tests/fixtures/index.js'
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

    const makeHttpRequestBody = () => makeUserParams()

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

    it('should call IdGeneratorAdapter to generate a random id', async () => {
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
        const user = makeHttpRequestBody()

        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })
    it('should call PasswordHasherAdapter to cryptograph password', async () => {
        const { sut, createUserRepository, passwordHasherAdapter } = makeSut()
        const user = makeHttpRequestBody()

        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')

        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepositoryEmail } = makeSut()

        jest.spyOn(
            getUserByEmailRepositoryEmail,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(makeHttpRequestBody())

        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()

        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const promise = sut.execute(makeHttpRequestBody())

        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()

        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(makeHttpRequestBody())

        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateUserRepository throws', async () => {
        const { sut, createUserRepository } = makeSut()

        jest.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(makeHttpRequestBody())

        await expect(promise).rejects.toThrow()
    })
})
