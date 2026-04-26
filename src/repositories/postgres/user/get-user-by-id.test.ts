import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/user.js'
import { PostgresGetUserByIdRepository } from './get-user-by-id.js'

describe('GetUserByEmailRepository', () => {
    let createdUser: Awaited<ReturnType<typeof prisma.user.create>>

    beforeEach(async () => {
        const user = makeUserParams()
        createdUser = await prisma.user.create({ data: user })
    })

    it('should GetUserByIdReposistory on db', async () => {
        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(createdUser.id)

        const { id, first_name, last_name, email } = createdUser

        expect(result).toStrictEqual({ id, first_name, last_name, email })
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByIdRepository()

        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(createdUser.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: createdUser.id,
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
            },
        })
    })
})
