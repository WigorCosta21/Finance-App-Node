import type { UserTokens } from '../../../types/auth.js'

export interface IRefreshTokenUseCase {
    execute(refreshToken: string): UserTokens
}
