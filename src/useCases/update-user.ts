import bcrypt from 'bcrypt'

import { EmailAlreadyInUseError } from '../errors/user.js'
import {
    PostgresUpdateUserRepository,
    PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js'
import type { UpdateUserParams } from '../types/user.js'

export class UpdateUserUseCase {
    async execute(userId: string, updateUserParams: UpdateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userWithProviderEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProviderEmail && userWithProviderEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = { ...updateUserParams }

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )

            user.password = hashedPassword
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

        const updatedUser = postgresUpdateUserRepository.execute(userId, user)

        return updatedUser
    }
}
