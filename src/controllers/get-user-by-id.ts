import type { Request } from 'express'

import { GetUserByIdUseCase } from '../useCases/index.js'
import {
    checkIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundRespose,
} from './helpers/index.js'
import type { UserIdParams } from '../types/user.js'

export class GetUserByIdController {
    constructor(private getUserByIdUseCase: GetUserByIdUseCase) {}

    async execute(httpRequest: Request<UserIdParams>) {
        try {
            const isIdValid = checkIdIsValid(httpRequest.params.userId)

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
            console.log(error)
            return serverError()
        }
    }
}
