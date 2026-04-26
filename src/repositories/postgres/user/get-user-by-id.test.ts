import { prisma } from '../../../../prisma/prisma.js'
import { makeUserParams } from '../../../tests/fixtures/user.js'
import { PostgresGetUserByIdRepository } from './get-user-by-id.js'

describe('GetUserByEmailRepository', () => {
    let createdUser: Awaited<ReturnType<typeof prisma.user.create>>

    beforeEach(async () => {
        const user = makeUserParams()
        createdUser = await prisma.user.create({ data: user })
    })

    it('should GetUserById on db', async () => {
        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(createdUser.id)

        const { id, first_name, last_name, email } = createdUser

        expect(result).toStrictEqual({ id, first_name, last_name, email })
    })
})
