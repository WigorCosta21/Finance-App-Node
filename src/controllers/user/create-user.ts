import type { Request } from 'express'
import { CreateUserUseCase } from '../../useCases/index.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUserResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
    validateRequiredFields,
    requiredFieldIsMissing,
} from '../helpers/index.js'

import type { CreateUserParams } from '../../types/user.js'

export class CreateUserController {
    constructor(private createUserUseCase: CreateUserUseCase) {}

    async execute(httpRequest: Request<unknown, unknown, CreateUserParams>) {
        try {
            const params = httpRequest.body

            const requiredFields: (keyof CreateUserParams)[] = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const { ok: requiredFieldWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldWereProvided && missingField) {
                return requiredFieldIsMissing(missingField)
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return emailIsAlreadyInUserResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({
                    message: error.message,
                })
            }

            console.error(error)

            return serverError()
        }
    }
}
