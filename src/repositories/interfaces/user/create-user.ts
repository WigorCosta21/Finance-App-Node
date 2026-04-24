import type { CreateUserParams, PublicUser } from '../../../types/user.js'

export interface ICreateUserRepository {
    execute(createUserParams: CreateUserParams): Promise<PublicUser>
}
