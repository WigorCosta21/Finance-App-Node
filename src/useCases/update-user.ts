import bcrypt from 'bcrypt'

import { EmailAlreadyInUseError } from '../errors/user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'

interface IUpdateUserParams {
    first_name?: string
    last_name?: string
    email?: string
    password?: string
}

export class UpdateUserUseCase {
    async execute(userId: string, updateUserParams: IUpdateUserParams) {
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
