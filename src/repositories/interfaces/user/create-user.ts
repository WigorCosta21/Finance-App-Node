import type {
    CreateUserRepositoryParams,
    PublicUser,
} from '../../../types/user.js'

export interface ICreateUserRepository {
    execute(createUserParams: CreateUserRepositoryParams): Promise<PublicUser>
}
