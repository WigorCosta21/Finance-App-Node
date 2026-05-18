import { type Request } from 'express'
import { makeUserParams } from '../../tests/fixtures/user.js'
import type { LoginUserResult } from '../../types/auth.js'
import type { User } from '../../types/user.js'
import type { ILoginUserUseCase } from '../../useCases/interfaces/user/login-user.js'
import { LoginUserController } from './login-user.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

describe('LoginUserController', () => {
    const user = makeUserParams()

    class LoginUserUseCaseStub implements ILoginUserUseCase {
        async execute(
            _email: string,
            _password: string,
        ): Promise<LoginUserResult> {
            return {
                ...user,
                tokens: {
                    accessToken: 'any_access_token',
                    refreshToken: 'any_refresh_token',
                },
            }
        }
    }

    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub()

        const sut = new LoginUserController(loginUserUseCase)

        return { sut, loginUserUseCase }
    }

    const httpRequest = {
        body: {
            email: 'any_email@email.com',
            password: 'any_password',
        },
    } as Request<unknown, unknown, User>

    it('should return 200 with user and tokens', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(httpRequest)

        const body = response.body as LoginUserResult

        expect(response.statusCode).toBe(200)
        expect(body.id).toBeDefined()
        expect(body.tokens.accessToken).toBe('any_access_token')
        expect(body.tokens.refreshToken).toBe('any_refresh_token')
    })

    it('should return 401 if password is invalid', async () => {
        const { sut, loginUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new InvalidPasswordError())

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(401)
    })

    it('should return 404 if user not found', async () => {
        const { sut, loginUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(404)
    })
})
