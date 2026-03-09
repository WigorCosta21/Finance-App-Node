import type { PublicUser } from '../../../types/user.js'

export interface IGetUserByEmailRepository {
    execute(email: string): Promise<PublicUser | null>
}
