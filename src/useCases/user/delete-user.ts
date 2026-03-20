import type { IDeleteUserRepository } from '../../repositories/interfaces/user/delete-user.js'
import type { IDeleteUserUseCase } from '../interfaces/user/delete-user.js'

export class DeleteUserUseCase implements IDeleteUserUseCase {
    constructor(private deleteUserRepository: IDeleteUserRepository) {}

    async execute(userId: string) {
        const deletedUser = await this.deleteUserRepository.execute(userId)

        return deletedUser
    }
}
