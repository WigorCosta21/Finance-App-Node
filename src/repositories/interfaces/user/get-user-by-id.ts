import type { PublicUser } from '../../../types/user.js'

export interface IGetUserByIdRepository {
    execute(userId: string): Promise<PublicUser | null>
}
