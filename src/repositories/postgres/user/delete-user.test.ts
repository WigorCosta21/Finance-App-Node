import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/index.js'
import { PostgresDeleteUserRepository } from './delete-user.js'

describe('PostgresDeleteUserRepository', () => {
    const user = makeUserParams()
    it('should delete a user on db', async () => {
        await prisma.user.create({
            data: user,
        })

        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        const { id, first_name, last_name, email } = user

        expect(result).toStrictEqual({ id, first_name, last_name, email })
    })

    it('should call Prisma with coreect params', async () => {
        const sut = new PostgresDeleteUserRepository()

        const prismaSpy = jest.spyOn(prisma.user, 'delete')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
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
