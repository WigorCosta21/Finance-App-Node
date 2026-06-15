import { UserNotFoundError } from '../../errors/user.js'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { userNotFoundRespose } from '../helpers/user.js'
import type { IGetTransactionByUserIdUseCase } from '../../useCases/interfaces/transaction/get-transaction-by-user-id.js'
import { getTransactionsByUserIdQuerySchema } from '../../schemas/transaction.js'
import { ZodError } from 'zod'

export class GetTransactionsByUserIdController {
    constructor(
        private GetTransactionsByUserIdUseCase: IGetTransactionByUserIdUseCase,
    ) {}

    async execute(userId: string, query: { from: string; to: string }) {
        try {
            const { from, to } =
                await getTransactionsByUserIdQuerySchema.parseAsync(query)

            const transactions =
                await this.GetTransactionsByUserIdUseCase.execute(
                    userId,
                    from,
                    to,
                )

            return ok(transactions)
        } catch (error) {
            console.error(error)

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

            return serverError()
        }
    }
}
