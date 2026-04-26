import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/user.js'
import { PostgresGetUserByEmailRepository } from './get-user-by-email.js'

describe('GetUserByEmailRepository', () => {
    let createdUser: Awaited<ReturnType<typeof prisma.user.create>>

    beforeEach(async () => {
        const user = makeUserParams()
        createdUser = await prisma.user.create({ data: user })
    })

    it('should GetUserByEmail on db', async () => {
        const sut = new PostgresGetUserByEmailRepository()

        const result = await sut.execute(createdUser.email)

        expect(result).toStrictEqual(createdUser)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByEmailRepository()

        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(createdUser.email)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: createdUser.email,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserByEmailRepository()
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        const promise = sut.execute(createdUser.email)

        await expect(promise).rejects.toThrow()
    })
})
