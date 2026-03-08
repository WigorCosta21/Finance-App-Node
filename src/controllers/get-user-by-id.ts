import type { Request } from 'express'
import validator from 'validator'

import { GetUserByIdUseCase } from '../useCases/get-user-by-id.js'
import { notFound, ok, serverError } from './helpers/http.js'
import { invalidIdResponse } from './helpers/user.js'
import type { UserIdParams } from '../types/user.js'

export class GetUserByIdController {
    async execute(httpRequest: Request<UserIdParams>) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return notFound('User not found')
            }

            return ok(user)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
