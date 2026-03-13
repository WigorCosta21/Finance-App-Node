import type { Request } from 'express'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'
import type { UpdateTransactionParams } from '../../types/transaction.js'
import {
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from '../helpers/transaction.js'
import type { UpdateTransactionUseCase } from '../../useCases/index.js'

interface ITransactionIdParams {
    transactionId: string
}

export class UpdateTransactionController {
    constructor(private updateTransactionUseCase: UpdateTransactionUseCase) {}

    async execute(
        httpRequest: Request<
            ITransactionIdParams,
            unknown,
            UpdateTransactionParams
        >,
    ) {
        try {
            const { transactionId } = httpRequest.params

            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            const allowedFields: (keyof UpdateTransactionParams)[] = [
                'name',
                'date',
                'amount',
                'type',
            ]

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) =>
                    !allowedFields.includes(
                        field as keyof UpdateTransactionParams,
                    ),
            )

            if (someFieldIsNotAllowed) {
                return badRequest('Some provided field is not allowed.')
            }

            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount)

                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }

            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)

                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }

            const transaction = await this.updateTransactionUseCase.execute(
                transactionId,
                params,
            )

            return ok(transaction)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
