import { UserNotFoundError } from '../../errors/user.js'
import type { IGetUserBalanceRepository } from '../../repositories/interfaces/user/get-user-balance.js'
import type { IGetUserByIdRepository } from '../../repositories/interfaces/user/get-user-by-id.js'
import type { IGetUserBalanceUseCase } from '../interfaces/user/get-user-balance.js'

export class GetUserBalanceUseCase implements IGetUserBalanceUseCase {
    constructor(
        private getUserBalanceRepository: IGetUserBalanceRepository,
        private getUserByIdRepository: IGetUserByIdRepository,
    ) {}

    async execute(userId: string, from: string, to: string) {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError()
        }

        const balance = await this.getUserBalanceRepository.execute(
            userId,
            from,
            to,
        )

        return balance
    }
}
