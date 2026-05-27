import { UserNotFoundError } from '../../errors/user.js'
import { ok, serverError } from '../helpers/http.js'
import { userNotFoundRespose } from '../helpers/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldIsMissing,
} from '../helpers/validation.js'
import type { IGetTransactionByUserIdUseCase } from '../../useCases/interfaces/transaction/get-transaction-by-user-id.js'

export class GetTransactionsByUserIdController {
    constructor(
        private GetTransactionsByUserIdUseCase: IGetTransactionByUserIdUseCase,
    ) {}

    async execute(userId: string) {
        try {
            if (!userId) {
                return requiredFieldIsMissing('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.GetTransactionsByUserIdUseCase.execute(userId)

            return ok(transactions)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundRespose()
            }

            return serverError()
        }
    }
}
