import type { Request } from 'express'
import { ok, serverError } from './../helpers/http.js'
import type { UserIdParams } from '../../types/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundRespose,
} from './../helpers/index.js'
import type { IDeleteUserUseCase } from '../../useCases/interfaces/user/delete-user.js'

export class DeleteUserController {
    constructor(private deleteUserUseCase: IDeleteUserUseCase) {}

    async execute(httpRequest: Request<UserIdParams>) {
        try {
            const userId = httpRequest.params.userId

            const idIsValid = checkIfIdIsValid(userId)

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
