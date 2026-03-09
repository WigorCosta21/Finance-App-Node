import type { Request } from 'express'
import { ok, serverError } from './../helpers/http.js'
import type { UserIdParams } from '../../types/user.js'
import {
    checkIdIsValid,
    invalidIdResponse,
    userNotFoundRespose,
} from './../helpers/user.js'
import { DeleteUserUseCase } from '../../useCases/index.js'

export class DeleteUserController {
    constructor(private deleteUserUseCase: DeleteUserUseCase) {}

    async execute(httpRequest: Request<UserIdParams>) {
        try {
            const userId = httpRequest.params.userId

            const idIsValid = checkIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(
                httpRequest.params.userId,
            )

            if (!deletedUser) {
                return userNotFoundRespose()
            }

            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
