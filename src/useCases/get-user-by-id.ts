import type { IGetUserByIdRepository } from '../repositories/interfaces/user/get-user-by-id.js'

export class GetUserByIdUseCase {
    constructor(private getUserByIdRepository: IGetUserByIdRepository) {}

    async execute(userId: string) {
        const user = await this.getUserByIdRepository.execute(userId)

        return user
    }
}
