import { jest } from '@jest/globals'
import { RefreshTokenController } from './refresh-token.js'
import { UnauthorizedError } from '../../errors/user.js'

describe('RefreshTokenController', () => {
    class RefreshTokenUseCaseStub {
        execute(_refleshToken: string) {
            return {
                accessToken: 'valid_access_token',
                refreshToken: 'valid_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const refreshTokenUseCase = new RefreshTokenUseCaseStub()
        const sut = new RefreshTokenController(refreshTokenUseCase)

        return {
            refreshTokenUseCase,
            sut,
        }
    }

    it('should return 400 if refresh token is invalid', () => {
        const { sut } = makeSut()

        // @ts-expect-error testing invalid type
        const response = sut.execute({ refreshToken: 2 })

        expect(response.statusCode).toBe(400)
    })

    it('should return 200 if refresh token is valid', () => {
        const { sut } = makeSut()

        const response = sut.execute({ refreshToken: '2' })

        expect(response.statusCode).toBe(200)
    })

    it('should return 200 if refresh token is valid', () => {
        const { sut, refreshTokenUseCase } = makeSut()

        jest.spyOn(refreshTokenUseCase, 'execute').mockImplementationOnce(
            () => {
                throw new UnauthorizedError()
            },
        )

        const response = sut.execute({ refreshToken: '2' })

        expect(response.statusCode).toBe(401)
    })
})
