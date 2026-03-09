import { PostgresHelper } from '../../../db/postgres/helper.js'
import type { PublicUser } from '../../../types/user.js'
import type { IGetUserByIdRepository } from '../../interfaces/user/get-user-by-id.js'

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
    async execute(userId: string): Promise<PublicUser | null> {
        const user = await PostgresHelper.query(
            'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
            [userId],
        )

        return user[0] ?? null
    }
}
