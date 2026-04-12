import type { Request } from 'express'

import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundRespose,
} from '../helpers/index.js'
import type { UserIdParams } from '../../types/user.js'
import type { IGetUserByIdUseCase } from '../../useCases/interfaces/user/get-user-by-id.js'

export class GetUserByIdController {
    constructor(private getUserByIdUseCase: IGetUserByIdUseCase) {}

    async execute(httpRequest: Request<UserIdParams>) {
        try {
            const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const user = await this.getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return userNotFoundRespose()
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
