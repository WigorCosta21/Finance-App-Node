import { prisma } from '../../../../prisma/prisma.js'
import type { CreateUserParams, PublicUser } from '../../../types/user.js'
import type { ICreateUserRepository } from '../../interfaces/user/create-user.js'

export class PostgresCreateUserRepository implements ICreateUserRepository {
    async execute(createUserParams: CreateUserParams): Promise<PublicUser> {
        const user = await prisma.user.create({
            data: {
                first_name: createUserParams.first_name,
                last_name: createUserParams.last_name,
                email: createUserParams.email,
                password: createUserParams.password,
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
            },
        })

        return user
    }
}
