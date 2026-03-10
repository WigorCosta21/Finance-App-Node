import type { Request } from 'express'
import type { CreateTransactionParams } from '../../types/transaction.js'
import { created, serverError } from '../helpers/http.js'
import type { CreateTransactionUseCase } from '../../useCases/transaction/create-transaction.js'
import {
    checkIdIsValid,
    invalidIdResponse,
    requiredFieldIsMissing,
    validateRequiredFields,
} from '../helpers/index.js'
import {
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from '../helpers/transaction.js'

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

            const amoutIsValid = checkIfAmountIsValid(params.amount)

            if (!amoutIsValid) {
                return invalidAmountResponse()
            }

            const typeIsValid = checkIfTypeIsValid(params.type)

            if (!typeIsValid) {
                return invalidTypeResponse()
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
