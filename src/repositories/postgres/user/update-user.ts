import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { prisma } from '../../../../prisma/prisma.js'
import type { UpdateUserParams } from '../../../types/user.js'
import type { IUpdateUserRepository } from '../../interfaces/user/update-user.js'
import { UserNotFoundError } from '../../../errors/user.js'

export class PostgresUpdateUserRepository implements IUpdateUserRepository {
    async execute(userId: string, updateParams: UpdateUserParams) {
        try {
            const user = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: updateParams,
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                },
            })

            return user ?? null
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                const code = error.code

                if (code === 'P2025') {
                    throw new UserNotFoundError(userId)
                }
            }

            throw new Error()
        }
    }
}
