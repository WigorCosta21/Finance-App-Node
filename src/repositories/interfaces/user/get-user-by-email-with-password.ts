import type { User } from '../../../types/user.js'

export interface IGetUserByEmailWithPasswordRepository {
    execute(email: string): Promise<User | null>
}
