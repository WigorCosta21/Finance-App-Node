import { jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import type { JwtPayload } from 'jsonwebtoken'
import type { ITokenVerifierAdapter } from '../../adapters/interfaces/token-verifier.js'
import type { ITokensGeneratorAdapter } from '../../adapters/interfaces/tokens-generator.js'
import { RefreshTokenUseCase } from './refresh-token.js'
import { UnauthorizedError } from '../../errors/user.js'

describe('RefreshTokenUseCase', () => {
    const userId = faker.string.uuid()

    class TokenVerifierAdapterStub implements ITokenVerifierAdapter {
        execute(
            _token: string,
            _secret: string,
        ): JwtPayload & { userId: string } {
            return { userId }
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
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()

        const sut = new RefreshTokenUseCase(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        )

        return {
            sut,
            tokenVerifierAdapter,
            tokensGeneratorAdapter,
        }
    }

    it('should return new tokens', () => {
        const { sut } = makeSut()
        const refreshToken = 'any_refresh_token'
        const result = sut.execute(refreshToken)

        expect(result).toEqual({
            accessToken: 'any_access_token',
            refreshToken: 'any_refresh_token',
        })
    })

    it('should throw if TokenVerifierAdapter throws', () => {
        const { sut, tokenVerifierAdapter } = makeSut()

        jest.spyOn(tokenVerifierAdapter, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        expect(() => sut.execute('any_refresh_token')).toThrow(
            new UnauthorizedError(),
        )
    })
})
