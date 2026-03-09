import { PostgresHelper } from '../../../db/postgres/helper.js'
import type {
    CreateUserRepositoryParams,
    PublicUser,
} from '../../../types/user.js'
import type { ICreateUserRepository } from '../../interfaces/user/create-user.js'

export class PostgresCreateUserRepository implements ICreateUserRepository {
    async execute(
        createUserParams: CreateUserRepositoryParams,
    ): Promise<PublicUser> {
        const createdUser = await PostgresHelper.query(
            'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING  id, first_name, last_name, email',
            [
                createUserParams.id,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )

        return createdUser[0]
    }
}
