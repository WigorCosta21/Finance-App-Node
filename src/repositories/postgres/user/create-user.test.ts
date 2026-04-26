import { jest } from '@jest/globals'
import { PostgresCreateUserRepository } from './create-user.js'
import { makeUserParams } from '../../../tests/fixtures/index.js'
import { prisma } from '../../../../prisma/prisma.js'
describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        const user = makeUserParams()
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
    })

    it('should call Prisma with correct params', async () => {
        const user = makeUserParams()
        const sut = new PostgresCreateUserRepository()

        const prismaSpy = jest.spyOn(prisma.user, 'create')

        await sut.execute(user)

        expect(prismaSpy).toHaveBeenCalledWith({
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
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
