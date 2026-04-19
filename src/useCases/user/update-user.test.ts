import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { UpdateUserUseCase } from './update-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import type { PublicUser } from '../../types/user.js'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetUserByEmailRepositoryStub {
        async execute(): Promise<PublicUser | null> {
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

    it('should UpdateUserUseCase successfully (with email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )

        const result = await sut.execute(user.id, {
            email: user.email,
        })

        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
        expect(result).toBe(user)
    })

    it('should UpdateUserUseCase successfully (with password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )

        const result = await sut.execute(user.id, {
            password: user.password,
        })

        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(user.password)
        expect(result).toBe(user)
    })

    it('should throw EmailAlreadyInUseErrror if email is already in use', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user)

        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call UpdateUserRepository with correct params', async () => {
        const { sut, updateUserRepository } = makeSut()

        const updateUserRepositorySpy = jest.spyOn(
            updateUserRepository,
            'execute',
        )

        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        }

        await sut.execute(user.id, updateUserParams)

        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            ...updateUserParams,
            password: 'hashed_password',
        })
    })
})
