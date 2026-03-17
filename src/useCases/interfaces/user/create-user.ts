import type { CreateUserParams, PublicUser } from '../../../types/user.js'

export interface ICreateUserUseCase {
    execute(createUserParams: CreateUserParams): Promise<PublicUser>
}
