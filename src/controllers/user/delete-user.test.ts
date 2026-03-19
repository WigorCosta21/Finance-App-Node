import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { DeleteUserController } from './delete-user.js'
import type { UserIdParams } from '../../types/user.js'

describe('Delete User Controller', () => {
    class DeleteUserUseCaseStub {
        async execute() {
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
})
