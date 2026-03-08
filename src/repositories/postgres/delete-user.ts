import { PostgresHelper } from '../../db/postgres/helper.js'
import type { PublicUser } from '../../types/user.js'
import type { IDeleteUserRepository } from '../interfaces/delete-user.js'

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
    async execute(userId: string): Promise<PublicUser | null> {
        const deletedUser = await PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )

        return deletedUser[0] ?? null
    }
}
