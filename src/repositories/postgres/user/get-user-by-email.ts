import { PostgresHelper } from '../../../db/postgres/helper.js'
import type { IGetUserByEmailRepository } from '../../interfaces/user/get-user-by-email.js'

export class PostgresGetUserByEmailRepository implements IGetUserByEmailRepository {
    async execute(email: string) {
        const user = await PostgresHelper.query(
            'SELECT * FROM users WHERE email = $1',
            [email],
        )

        return user[0] ?? null
    }
}
