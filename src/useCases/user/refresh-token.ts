import type { ITokenVerifierAdapter } from '../../adapters/interfaces/token-verifier.js'
import type { ITokensGeneratorAdapter } from '../../adapters/interfaces/tokens-generator.js'
import { UnauthorizedError } from '../../errors/user.js'
import type { IRefreshTokenUseCase } from '../interfaces/user/refresh-token.js'

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        private tokensGeneratorAdapter: ITokensGeneratorAdapter,
        private tokenVerifierAdapter: ITokenVerifierAdapter,
    ) {}

    execute(refleshToken: string) {
        try {
            const decodedToken = this.tokenVerifierAdapter.execute(
                refleshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET as string,
            )
            return this.tokensGeneratorAdapter.execute(decodedToken.userId)
        } catch (error) {
            console.error(error)
            throw new UnauthorizedError()
        }
    }
}
