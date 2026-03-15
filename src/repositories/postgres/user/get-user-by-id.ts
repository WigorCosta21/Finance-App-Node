import { prisma } from '../../../../prisma/prisma.js'
import type { PublicUser } from '../../../types/user.js'
import type { IGetUserByIdRepository } from '../../interfaces/user/get-user-by-id.js'

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
    async execute(userId: string): Promise<PublicUser | null> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
            },
        })
        return user ?? null
    }
}
