import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundRespose,
} from '../helpers/index.js'
import type { IGetUserByIdUseCase } from '../../useCases/interfaces/user/get-user-by-id.js'

export class GetUserByIdController {
    constructor(private getUserByIdUseCase: IGetUserByIdUseCase) {}

    async execute(userId: string) {
        try {
            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const user = await this.getUserByIdUseCase.execute(userId)

            if (!user) {
                return userNotFoundRespose()
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
