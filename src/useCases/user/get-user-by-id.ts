import type { IGetUserByIdUseCase } from '../interfaces/user/get-user-by-id.js'

export class GetUserByIdUseCase {
    constructor(private getUserByIdRepository: IGetUserByIdUseCase) {}

    async execute(userId: string) {
        const user = await this.getUserByIdRepository.execute(userId)

        return user
    }
}
