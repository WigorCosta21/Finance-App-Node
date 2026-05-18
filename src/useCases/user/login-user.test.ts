import type {
    IPasswordComparatorAdapter,
    ITokensGeneratorAdapter,
} from '../../adapters/interfaces/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
import type { IGetUserByEmailWithPasswordRepository } from '../../repositories/interfaces/user/get-user-by-email-with-password.js'
import { makeUserParams } from '../../tests/fixtures/index.js'
import type { User } from '../../types/user.js'
import { LoginUserUseCase } from './login-user.js'

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub implements IGetUserByEmailWithPasswordRepository {
        async execute(_email: string): Promise<User | null> {
            return makeUserParams()
        }
    }

    class PasswordComparatorAdapterStub implements IPasswordComparatorAdapter {
        async execute(_password: string, _hash: string): Promise<boolean> {
            return true
        }
    }

    class TokensGeneratorAdapterStub implements ITokensGeneratorAdapter {
        execute(_userId: string) {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapterStub =
            new PasswordComparatorAdapterStub()
        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub()

        const sut = new LoginUserUseCase(
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapterStub,
        )
        return {
            sut,
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapterStub,
        }
    }

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepositoryStub, 'execute')
            .mockResolvedValueOnce(null)

        const promise = sut.execute('any_email', 'any_password')

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw invalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapterStub } = makeSut()

        import.meta.jest
            .spyOn(passwordComparatorAdapterStub, 'execute')
            .mockResolvedValue(false)

        const promise = sut.execute('password', 'hashed_password')

        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('any_email', 'any_password')

        expect(result.tokens.accessToken).toBeDefined()
    })
})
