import { PostgresHelper } from '../../../db/postgres/helper.js'
import type { PublicUser } from '../../../types/user.js'
import type { IDeleteUserRepository } from '../../interfaces/user/delete-user.js'

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
    async execute(userId: string): Promise<PublicUser | null> {
        const deletedUser = await PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING  id, first_name, last_name, email',
            [userId],
        )

        return deletedUser[0] ?? null
    }
}
