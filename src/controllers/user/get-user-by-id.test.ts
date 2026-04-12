import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { GetUserByIdController } from './get-user-by-id.js'
import type { PublicUser, UserIdParams } from '../../types/user.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseSub {
        async execute(): Promise<PublicUser | null> {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseSub()

        const sub = new GetUserByIdController(getUserByIdUseCase)

        return { getUserByIdUseCase, sub }
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

    it('should return 400 if an invalid id is provided', async () => {
        const { sub } = makeSut()

        const result = await sub.execute(makeHttpRequest('invalid_id'))

        expect(result.statusCode).toBe(400)
    })

    it('shold return 404 if a user if not found', async () => {
        const { sub, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws an erros', async () => {
        const { sub, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(500)
    })
})
