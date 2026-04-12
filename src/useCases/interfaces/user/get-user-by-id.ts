import type { PublicUser } from '../../../types/user.js'

export interface IGetUserByIdUseCase {
    execute(userId: string): Promise<PublicUser | null>
}
