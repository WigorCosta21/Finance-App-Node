import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { DeleteUserController } from './delete-user.js'
import type { PublicUser, UserIdParams } from '../../types/user.js'

describe('Delete User Controller', () => {
    class DeleteUserUseCaseStub {
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
        const deleteUserUseCase = new DeleteUserUseCaseStub()

        const sub = new DeleteUserController(deleteUserUseCase)

        return { deleteUserUseCase, sub }
    }

    const makeHttpRequest = (userId?: string) =>
        ({
            params: {
                userId: userId ?? faker.string.uuid(),
            },
        }) as Request<UserIdParams>

    it('should return 200 if user is deleted', async () => {
        const { sub } = makeSut()

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        const { sub } = makeSut()

        const result = await sub.execute(makeHttpRequest('invalid_id'))

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        const { sub, deleteUserUseCase } = makeSut()

        jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValueOnce(null)

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteUserUseCase throws', async () => {
        const { sub, deleteUserUseCase } = makeSut()

        jest.spyOn(deleteUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(500)
    })
})
