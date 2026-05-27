import type { CreateTransactionParams } from '../../types/transaction.js'
import { badRequest, created, serverError } from '../helpers/http.js'
import { ZodError } from 'zod'
import type { ICreateTransactionUseCase } from '../../useCases/interfaces/transaction/create-transaction.js'
import { UserNotFoundError } from '../../errors/user.js'
import { userNotFoundRespose } from '../helpers/user.js'
import { createTransactionSchema } from '../../schemas/transaction.js'

export class CreateTransactionController {
    constructor(private createTransactionUseCase: ICreateTransactionUseCase) {}

    async execute(
        userId: string,
        params: Omit<CreateTransactionParams, 'user_id'>,
    ) {
        try {
            const validatedParams =
                await createTransactionSchema.parseAsync(params)

            const transaction = await this.createTransactionUseCase.execute({
                ...validatedParams,
                user_id: userId,
            })

            return created(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                })
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundRespose()
            }

            console.error(error)
            return serverError()
        }
    }
}
