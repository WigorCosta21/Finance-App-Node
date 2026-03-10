import type { Request } from 'express'
import validator from 'validator'

import type { CreateTransactionParams } from '../../types/transaction.js'
import { badRequest, created, serverError } from '../helpers/http.js'
import type { CreateTransactionUseCase } from '../../useCases/transaction/create-transaction.js'
import {
    checkIdIsValid,
    invalidIdResponse,
    requiredFieldIsMissing,
    validateRequiredFields,
} from '../helpers/index.js'

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
            const { ok: requiredFieldWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldWereProvided && missingField) {
                return requiredFieldIsMissing(missingField)
            }

            const userIdValid = checkIdIsValid(params.user_id)

            if (!userIdValid) {
                return invalidIdResponse()
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
