import { badRequest, ok, serverError } from '../helpers/http.js'
import { userNotFoundRespose } from '../helpers/user.js'
import { UserNotFoundError } from '../../errors/user.js'
import type { IGetUserBalanceUseCase } from '../../useCases/interfaces/user/get-user-balance.js'
import { getUserBalanceQuerySchema } from '../../schemas/user.js'
import { ZodError } from 'zod'

export class GetUserBalanceController {
    constructor(private getUserBalanceUseCase: IGetUserBalanceUseCase) {}

    async execute(userId: string, query: { from: string; to: string }) {
        try {
            const { from, to } = await getUserBalanceQuerySchema.parse(query)

            const balance = await this.getUserBalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return ok(balance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundRespose()
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                })
            }

            console.error(error)
            return serverError()
        }
    }
}
