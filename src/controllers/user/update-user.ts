import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    ok,
    serverError,
    userNotFoundRespose,
} from './../helpers/index.js'
import type { UpdateUserParams } from '../../types/user.js'
import { updateUserSchema } from '../../schemas/user.js'
import { ZodError } from 'zod'
import type { IUpdateUserUseCase } from '../../useCases/interfaces/user/update-user.js'

export class UpdateUserController {
    constructor(private updateUserUseCase: IUpdateUserUseCase) {}
    async execute(userId: string, params: UpdateUserParams) {
        try {
            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

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

            if (error instanceof UserNotFoundError) {
                return userNotFoundRespose()
            }

            console.error(error)
            return serverError()
        }
    }
}
