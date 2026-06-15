import type { UserBalance } from '../../../types/user.js'

export interface IGetUserBalanceUseCase {
    execute(userId: string, from: string, to: string): Promise<UserBalance>
}
