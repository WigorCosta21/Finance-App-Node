import type { Request } from 'express'
import type { CreateTransactionParams } from '../../types/transaction.js'
import { badRequest, created, serverError } from '../helpers/http.js'
import type { CreateTransactionUseCase } from '../../useCases/transaction/create-transaction.js'
import { createTransactionSchema } from '../../schemas/transaction.js'
import { ZodError } from 'zod'

export class CreateTransactionController {
    constructor(private createTransactionUseCase: CreateTransactionUseCase) {}

    async execute(
        httpRequest: Request<unknown, unknown, CreateTransactionParams>,
    ) {
        try {
            const params = await createTransactionSchema.parseAsync(
                httpRequest.body,
            )

            const transaction =
                await this.createTransactionUseCase.execute(params)

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

            console.error(error)
            return serverError()
        }
    }
}
