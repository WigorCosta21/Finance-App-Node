import type { Request } from 'express'
import type { UserBalance, UserIdParams } from '../../types/user.js'
import { ok, serverError } from '../helpers/http.js'
import { userNotFoundRespose } from '../helpers/user.js'
import { UserNotFoundError } from '../../errors/user.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'
import type { IGetUserBalanceUseCase } from '../../useCases/interfaces/user/get-user-balance.js'

export class GetUserBalanceController {
    constructor(private getUserBalanceUseCase: IGetUserBalanceUseCase) {}

    async execute(httpRequest: Request<UserIdParams, unknown, UserBalance>) {
        try {
            const userId = httpRequest.params.userId

            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const balance = await this.getUserBalanceUseCase.execute(userId)

            return ok(balance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundRespose()
            }

            console.error(error)
            return serverError()
        }
    }
}
