import type { PublicUser } from './user.js'

export interface UserTokens {
    accessToken: string
    refreshToken: string
}

export type LoginUserResult = PublicUser & {
    tokens: UserTokens
}
