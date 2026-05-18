import { type Request } from 'express'
import type { ILoginUserUseCase } from '../../useCases/interfaces/user/login-user.js'
import {
    badRequest,
    ok,
    serverError,
    unauthorized,
    userNotFoundRespose,
} from '../helpers/index.js'
import type { User } from '../../types/user.js'
import { loginSchema } from '../../schemas/index.js'
import { ZodError } from 'zod'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserController {
    constructor(private loginUserUsecase: ILoginUserUseCase) {}

    async execute(httpRequest: Request<unknown, unknown, User>) {
        try {
            const params = httpRequest.body

            await loginSchema.parseAsync(params)

            const user = await this.loginUserUsecase.execute(
                params.email,
                params.password,
            )

            return ok(user)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                })
            }

            if (error instanceof InvalidPasswordError) {
                return unauthorized()
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundRespose()
            }

            return serverError()
        }
    }
}
