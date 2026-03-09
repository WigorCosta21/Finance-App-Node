import type { Request } from 'express'
import { UpdateUserUseCase } from '../../useCases/index.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    checkIdIsValid,
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUserResponse,
    invalidIdResponse,
    invalidPasswordResponse,
    badRequest,
    ok,
    serverError,
} from './../helpers/index.js'
import type { UpdateUserParams, UserIdParams } from '../../types/user.js'

export class UpdateUserController {
    constructor(private updateUserUseCase: UpdateUserUseCase) {}
    async execute(
        httpRequest: Request<UserIdParams, unknown, UpdateUserParams>,
    ) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIdIsValid(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            const allowedFields: (keyof UpdateUserParams)[] = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) =>
                    !allowedFields.includes(field as keyof UpdateUserParams),
            )

            if (someFieldIsNotAllowed) {
                return badRequest('Some provided field is not allowed.')
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password)

                if (!passwordIsValid) {
                    return invalidPasswordResponse()
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)

                if (!emailIsValid) {
                    return emailIsAlreadyInUserResponse()
                }
            }

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            return ok(updatedUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ error: error.message })
            }

            console.error(error)
            return serverError()
        }
    }
}
