import type { JwtPayload } from 'jsonwebtoken'

export interface ITokenVerifierAdapter {
    execute(token: string, secret: string): JwtPayload & { userId: string }
}
