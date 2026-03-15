import { prisma } from '../../../../prisma/prisma.js'
import type { IGetUserByEmailRepository } from '../../interfaces/user/get-user-by-email.js'

export class PostgresGetUserByEmailRepository implements IGetUserByEmailRepository {
    async execute(email: string) {
        const user = await prisma.user.findUnique({ where: { email } })
        return user ?? null
    }
}
