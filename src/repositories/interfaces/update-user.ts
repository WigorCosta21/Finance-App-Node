import type { PublicUser, UpdateUserParams } from '../../types/user.js'

export interface IUpdateUserRepository {
    execute(
        userId: string,
        updateUserParams: UpdateUserParams,
    ): Promise<PublicUser | null>
}
