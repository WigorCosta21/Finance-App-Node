import { EmailAlreadyInUseError } from '../../errors/user.js'
import type { UpdateUserParams } from '../../types/user.js'
import type { IUpdateUserRepository } from '../../repositories/interfaces/user/update-user.js'
import type { IGetUserByEmailRepository } from '../../repositories/interfaces/user/get-user-by-email.js'
import type { IUpdateUserUseCase } from '../interfaces/user/update-user.js'
import type { PasswordHasherAdapter } from '../../adapters/password-hasher.js'

export class UpdateUserUseCase implements IUpdateUserUseCase {
    constructor(
        private updateUserRepository: IUpdateUserRepository,
        private postgresGetUserByEmail: IGetUserByEmailRepository,
        private passwordHasherAdapter: PasswordHasherAdapter,
    ) {}

    async execute(userId: string, updateUserParams: UpdateUserParams) {
        if (updateUserParams.email) {
            const userWithProviderEmail =
                await this.postgresGetUserByEmail.execute(
                    updateUserParams.email,
                )

            if (userWithProviderEmail && userWithProviderEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = { ...updateUserParams }

        if (updateUserParams.password) {
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateUserParams.password,
            )

            user.password = hashedPassword
        }

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user,
        )

        return updatedUser
    }
}
