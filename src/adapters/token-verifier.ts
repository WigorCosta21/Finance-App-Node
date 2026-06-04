import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { ITokenVerifierAdapter } from './interfaces/token-verifier.js'

export class TokenVerifierAdapter implements ITokenVerifierAdapter {
    execute(token: string, secret: string) {
        return jwt.verify(token, secret) as JwtPayload & { userId: string }
    }
}
