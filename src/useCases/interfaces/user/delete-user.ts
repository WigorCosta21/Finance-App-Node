import type { PublicUser } from '../../../types/user.js'

export interface IDeleteUserUseCase {
    execute(userId: string): Promise<PublicUser | null>
}
