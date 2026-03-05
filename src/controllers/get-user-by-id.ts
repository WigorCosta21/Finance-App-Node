import type { Request } from 'express'
import validator from 'validator'

import { GetUserByIdUseCase } from '../useCases/get-user-by-id.js'
import { badRequest, ok, serverError } from './helper.js'

interface UserParams {
    userId: string
}

export class GetUserByIdController {
    async execute(httpRequest: Request<UserParams>) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({
                    message: 'The provided is not valid',
                })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            return ok(user)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
