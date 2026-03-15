import { Prisma } from '../../../../generated/prisma/client.js'
import { prisma } from '../../../../prisma/prisma.js'
import type { PublicUser } from '../../../types/user.js'
import type { IDeleteUserRepository } from '../../interfaces/user/delete-user.js'

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
    async execute(userId: string): Promise<PublicUser | null> {
        try {
            const deletedUser = await prisma.user.delete({
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

            return deletedUser
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                return null
            }

            return null
        }
    }
}
