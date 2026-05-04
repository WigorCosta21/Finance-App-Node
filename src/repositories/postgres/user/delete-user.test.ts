import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/index.js'
import { PostgresDeleteUserRepository } from './delete-user.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { UserNotFoundError } from '../../../errors/user.js'

describe('PostgresDeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        const user = makeUserParams()
        await prisma.user.create({ data: user })

        const sut = new PostgresDeleteUserRepository()
        const result = await sut.execute(user.id)

        const { id, first_name, last_name, email } = user
        expect(result).toStrictEqual({ id, first_name, last_name, email })
    })

    it('should call Prisma with correct params', async () => {
        const user = makeUserParams()
        await prisma.user.create({ data: user })

        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'delete')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: user.id },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
            },
        })
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        const user = makeUserParams()
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())

        await expect(sut.execute(user.id)).rejects.toThrow()
    })

    it('should throw UserNotFoundError if Prisma throws P2025', async () => {
        const user = makeUserParams()
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
                clientVersion: '0.0.0',
            }),
        )

        await expect(sut.execute(user.id)).rejects.toThrow(
            new UserNotFoundError(user.id),
        )
    })
})
