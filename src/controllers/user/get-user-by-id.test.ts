import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'
import type { PublicUser, UserIdParams } from '../../types/user.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseSub {
        async execute(): Promise<PublicUser> {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdSub = new GetUserByIdUseCaseSub()

        const sub = new GetUserByIdController(getUserByIdSub)

        return { getUserByIdSub, sub }
    }

    const makeHttpRequest = (userId?: string) => {
        return {
            params: {
                userId: userId ?? faker.string.uuid(),
            },
        } as Request<UserIdParams>
    }

    it('should return 200 if a user is found', async () => {
        const { sub } = makeSut()

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(200)
    })
})
