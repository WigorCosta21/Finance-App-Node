import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/user.js'
import { PostgresUpdateUserRepository } from './update-user.js'
import type { UpdateUserParams } from '../../../types/user.js'

describe('GetUserByEmailRepository', () => {
    let createdUser: Awaited<ReturnType<typeof prisma.user.create>>

    beforeEach(async () => {
        const user = makeUserParams()
        createdUser = await prisma.user.create({ data: user })
    })

    it('should GetUpdateUserRepository on db', async () => {
        const sut = new PostgresUpdateUserRepository()

        const updateUserParams: UpdateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
        }

        const result = await sut.execute(createdUser.id, updateUserParams)

        expect(result).toStrictEqual({
            id: createdUser.id,
            ...updateUserParams,
        })
    })
})
