import type { Request } from 'express'
import validator from 'validator'
import { badRequest, ok, serverError } from './helper.js'
import { UpdateUserUseCase } from '../useCases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

interface IUpdateUserParams {
    userId: string
}

interface IUpdateUserBody {
    first_name?: string
    last_name?: string
    email?: string
    password?: string
}

export class UpdateUserController {
    async execute(
        httpRequest: Request<IUpdateUserParams, unknown, IUpdateUserBody>,
    ) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({
                    message: 'The provided is not valid',
                })
            }

            const updatedUserParams = httpRequest.body

            const allowedFields: (keyof IUpdateUserBody)[] = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(updatedUserParams).some(
                (field) =>
                    !allowedFields.includes(field as keyof IUpdateUserBody),
            )

            if (someFieldIsNotAllowed) {
                return badRequest('Some provided field is not allowed.')
            }

            if (updatedUserParams.password) {
                const passwordIsNotValid =
                    updatedUserParams.password?.length < 6

                if (passwordIsNotValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters',
                    })
                }
            }

            if (updatedUserParams.email) {
                const emailIsValid = validator.isEmail(updatedUserParams.email)

                if (!emailIsValid) {
                    return badRequest({
                        message: 'Invalid e-mail. Please provide a valid one.',
                    })
                }
            }

            const updateUserCase = new UpdateUserUseCase()

            const updatedUser = await updateUserCase.execute(
                userId,
                updatedUserParams,
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
