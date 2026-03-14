import type { UserBalance } from '../../../types/user.js'

export interface IGetUserBalanceRepository {
    execute(userId: string): Promise<UserBalance>
}
