import type { IDeleteUserRepository } from '../../repositories/interfaces/user/delete-user.js'

export class DeleteUserUseCase {
    constructor(private deleteUserRepository: IDeleteUserRepository) {}

    async execute(userId: string) {
        const deletedUser = await this.deleteUserRepository.execute(userId)

        return deletedUser
    }
}
