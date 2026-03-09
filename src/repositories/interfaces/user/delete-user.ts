import type { PublicUser } from '../../../types/user.js'

export interface IDeleteUserRepository {
    execute(userId: string): Promise<PublicUser | null>
}
