import type { Request } from 'express'
import { ZodError } from 'zod'

import { EmailAlreadyInUseError } from '../../errors/user.js'
import { badRequest, created, serverError } from '../helpers/index.js'

import type { CreateUserParams } from '../../types/user.js'
import { createUserSchema } from '../../schemas/index.js'
import type { ICreateUserUseCase } from '../../useCases/interfaces/user/create-user.js'

export class CreateUserController {
    constructor(private createUserUseCase: ICreateUserUseCase) {}

    async execute(httpRequest: Request<unknown, unknown, CreateUserParams>) {
        try {
            const params = httpRequest.body

            await createUserSchema.parseAsync(params)

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                })
            }

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
