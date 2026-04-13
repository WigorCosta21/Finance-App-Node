import type { Request } from 'express'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    ok,
    serverError,
} from './../helpers/index.js'
import type { UpdateUserParams, UserIdParams } from '../../types/user.js'
import { updateUserSchema } from '../../schemas/user.js'
import { ZodError } from 'zod'
import type { IUpdateUserUseCase } from '../../useCases/interfaces/user/update-user.js'

export class UpdateUserController {
    constructor(private updateUserUseCase: IUpdateUserUseCase) {}
    async execute(
        httpRequest: Request<UserIdParams, unknown, UpdateUserParams>,
    ) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            return ok(updatedUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues.map((issue) => ({
                        field: issue.path.join('.') || 'body',
                        message:
                            issue.code === 'unrecognized_keys'
                                ? 'Some provided field is not allowed'
                                : issue.message,
                    })),
                })
            }

            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ error: error.message })
            }

            console.error(error)
            return serverError()
        }
    }
}
