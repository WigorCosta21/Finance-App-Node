import type { UserBalance } from '../../../types/user.js'

export interface IGetUserBalanceUseCase {
    execute(userId: string): Promise<UserBalance>
}
