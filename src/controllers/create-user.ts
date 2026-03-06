import type { Request } from 'express'
import validator from 'validator'
import { CreateUserUseCase } from '../useCases/create-user.js'
import { badRequest, created, serverError } from './helper.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

interface CreateUserBody {
    first_name: string
    last_name: string
    email: string
    password: string
}

export class CreateUserController {
    async execute(httpRequest: Request<unknown, unknown, CreateUserBody>) {
        try {
            const params = httpRequest.body

            const requiredFields: (keyof CreateUserBody)[] = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const passwordIsNotValid = params.password.length < 6

            if (passwordIsNotValid) {
                return badRequest({
                    message: 'Password must be at least 6 characters',
                })
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badRequest({
                    message: 'Invalid e-mail. Please provide a valid one.',
                })
            }

            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

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
