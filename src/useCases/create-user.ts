import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../errors/user.js'
import type { CreateUserParams } from '../types/user.js'
import type { ICreateUserRepository } from '../repositories/interfaces/create-user.js'
import type { IGetUserByEmailRepository } from '../repositories/interfaces/get-user-by-email.js'

export class CreateUserUseCase {
    constructor(
        private createUserRepository: ICreateUserRepository,
        private getUserByEmail: IGetUserByEmailRepository,
    ) {}

    async execute(createUserParams: CreateUserParams) {
        const userWithProviderEmail = await this.getUserByEmail.execute(
            createUserParams.email,
        )

        if (userWithProviderEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        const userId = uuidv4()

        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        const createdUser = await this.createUserRepository.execute(user)

        return createdUser
    }
}
