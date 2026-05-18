import type {
    IPasswordComparatorAdapter,
    ITokensGeneratorAdapter,
} from '../../adapters/interfaces/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
import type { IGetUserByEmailWithPasswordRepository } from '../../repositories/interfaces/user/get-user-by-email-with-password.js'
import type { ILoginUserUseCase } from '../interfaces/user/login-user.js'

export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        private getUserByEmailRepository: IGetUserByEmailWithPasswordRepository,
        private passwordComparatorAdapter: IPasswordComparatorAdapter,
        private tokensGeneratorAdapter: ITokensGeneratorAdapter,
    ) {}

    async execute(email: string, password: string) {
        const user = await this.getUserByEmailRepository.execute(email)

        if (!user) {
            throw new UserNotFoundError()
        }

        const isPasswordValid = await this.passwordComparatorAdapter.execute(
            password,
            user.password,
        )

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        const { password: _, ...userWithoutPassword } = user

        return {
            ...userWithoutPassword,
            tokens: this.tokensGeneratorAdapter.execute(user.id),
        }
    }
}
