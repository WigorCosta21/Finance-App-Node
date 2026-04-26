import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/user.js'
import { PostgresUpdateUserRepository } from './update-user.js'
import type { UpdateUserParams } from '../../../types/user.js'

describe('GetUserByEmailRepository', () => {
    let fakerUser: Awaited<ReturnType<typeof prisma.user.create>>

    beforeEach(async () => {
        const user = makeUserParams()
        fakerUser = await prisma.user.create({ data: user })
    })

    const updateUserParams: UpdateUserParams = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
    }

    it('should GetUpdateUserRepository on db', async () => {
        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(fakerUser.id, updateUserParams)

        expect(result).toStrictEqual({
            id: fakerUser.id,
            ...updateUserParams,
        })
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresUpdateUserRepository()

        const prismaSpy = jest.spyOn(prisma.user, 'update')

        await sut.execute(fakerUser.id, updateUserParams)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakerUser.id,
            },
            data: updateUserParams,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
            },
        })
    })
})
