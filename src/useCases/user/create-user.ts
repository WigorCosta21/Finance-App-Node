import { EmailAlreadyInUseError } from '../../errors/user.js'
import type { CreateUserParams } from '../../types/user.js'
import type { IGetUserByEmailRepository } from '../../repositories/interfaces/user/get-user-by-email.js'
import type {
    PasswordHasherAdapter,
    IdGeneratorAdapter,
    TokensGeneratorAdapter,
} from '../../adapters/index.js'
import type { ICreateUserUseCase } from '../interfaces/user/create-user.js'
import type { ICreateUserRepository } from '../../repositories/interfaces/user/create-user.js'

export class CreateUserUseCase implements ICreateUserUseCase {
    constructor(
        private createUserRepository: ICreateUserRepository,
        private getUserByEmail: IGetUserByEmailRepository,
        private passwordHasherAdapter: PasswordHasherAdapter,
        private idGeneratorAdapter: IdGeneratorAdapter,
        private tokensGeneratorAdapter: TokensGeneratorAdapter,
    ) {}

    async execute(createUserParams: CreateUserParams) {
        const userWithProviderEmail = await this.getUserByEmail.execute(
            createUserParams.email,
        )

        if (userWithProviderEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        const userId = this.idGeneratorAdapter.execute()

        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        const createdUser = await this.createUserRepository.execute(user)

        return {
            ...createdUser,
            tokens: this.tokensGeneratorAdapter.execute(userId),
        }
    }
}
