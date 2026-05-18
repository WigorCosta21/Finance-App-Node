import type { LoginUserResult } from '../../../types/auth.js'

export interface ILoginUserUseCase {
    execute(email: string, password: string): Promise<LoginUserResult>
}
