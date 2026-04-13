import type { PublicUser, UpdateUserParams } from '../../../types/user.js'

export interface IUpdateUserUseCase {
    execute(
        userId: string,
        updateUserParams: UpdateUserParams,
    ): Promise<PublicUser | null>
}
