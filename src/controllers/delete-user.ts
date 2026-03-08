import type { Request } from 'express'
import { ok, serverError } from './helpers/http.js'
import type { UserIdParams } from '../types/user.js'
import { checkIdIsValid, invalidIdResponse } from './helpers/user.js'
import { DeleteUserUseCase } from '../useCases/index.js'

export class DeleteUserController {
    async execute(httpRequest: Request<UserIdParams>) {
        try {
            const userId = httpRequest.params.userId

            const idIsValid = checkIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deleteUserUseCase = new DeleteUserUseCase()

            const deletedUser = await deleteUserUseCase.execute(userId)

            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
