import { PostgresHelper } from '../../../db/postgres/helper.js'
import type { IGetUserBalanceRepository } from '../../interfaces/user/get-user-balance.js'

export class PostgresGetUserBalanceRepository implements IGetUserBalanceRepository {
    async execute(userId: string) {
        const balance = await PostgresHelper.query(
            `SELECT * FROM get_user_balance($1)`,
            [userId],
        )

        return {
            userId,
            ...balance[0],
        }
    }
}
