// src/adapters/interfaces/tokens-generator.ts
export interface ITokensGeneratorAdapter {
    execute(userId: string): {
        accessToken: string
        refreshToken: string
    }
}
