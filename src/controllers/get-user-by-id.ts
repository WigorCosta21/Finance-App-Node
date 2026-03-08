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
    async execute(httpRequest: Request<UserIdParams>) {
        try {
            const isIdValid = checkIdIsValid(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
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
