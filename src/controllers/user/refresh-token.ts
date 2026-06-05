import { ZodError } from 'zod'
import type { IRefreshTokenUseCase } from '../../useCases/interfaces/user/refresh-token.js'
import { badRequest, ok, serverError, unauthorized } from '../helpers/http.js'
import { UnauthorizedError } from '../../errors/user.js'
import { refreshTokenSchema } from '../../schemas/user.js'

export class RefreshTokenController {
    constructor(private refreshTokenUseCase: IRefreshTokenUseCase) {}

    execute(params: { refreshToken: string }) {
        try {
            const { refreshToken } = refreshTokenSchema.parse(params)

            const response = this.refreshTokenUseCase.execute(refreshToken)

            return ok(response)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                })
            }

            if (error instanceof UnauthorizedError) {
                return unauthorized()
            }

            console.error(error)
            return serverError()
        }
    }
}
