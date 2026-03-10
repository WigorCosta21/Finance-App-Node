import type { Request } from 'express'
import validator from 'validator'

import type { CreateTransactionParams } from '../../types/transaction.js'
import { badRequest, created, serverError } from '../helpers/http.js'
import type { CreateTransactionUseCase } from '../../useCases/transaction/create-transaction.js'
import { checkIdIsValid, invalidIdResponse } from '../helpers/index.js'

export class CreateTransactionController {
    constructor(private createTransactionUseCase: CreateTransactionUseCase) {}

    async execute(
        httpRequest: Request<unknown, unknown, CreateTransactionParams>,
    ) {
        try {
            const params = httpRequest.body

            const requiredFields: (keyof CreateTransactionParams)[] = [
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]

            for (const field of requiredFields) {
                if (
                    !params[field] ||
                    params[field].toString().trim().length === 0
                ) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const userIdValid = checkIdIsValid(params.user_id)

            if (!userIdValid) {
                return invalidIdResponse()
            }

            if (params.amount <= 0) {
                return badRequest({
                    message: 'The amount must be grater than 0.',
                })
            }

            const amoutIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            )

            if (!amoutIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency.',
                })
            }

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                params.type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE, INVESTMENT',
                })
            }

            const trasaction =
                await this.createTransactionUseCase.execute(params)

            return created(trasaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
