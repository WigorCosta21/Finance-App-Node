import { type Request } from 'express'
import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user.js'
import type {
    PublicUser,
    UpdateUserParams,
    UserIdParams,
} from '../../types/user.js'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(
            _userId: string,
            updateUserParams: UpdateUserParams,
        ): Promise<PublicUser | null> {
            return {
                id: faker.string.uuid(),
                first_name:
                    updateUserParams.first_name ?? faker.person.firstName(),
                last_name:
                    updateUserParams.last_name ?? faker.person.lastName(),
                email: updateUserParams.email ?? faker.internet.email(),
            }
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { updateUserUseCase, sut }
    }

    const makeHttpRequestBody = (body?: UpdateUserParams, userId?: string) => {
        return {
            params: {
                userId: userId ?? faker.string.uuid(),
            },
            body: body ?? {
                first_name: faker.person.firstName(),
            },
        } as Request<UserIdParams, unknown, UpdateUserParams>
    }

    it('should return 200 when updating an user successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(makeHttpRequestBody())

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when an invalid email is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequestBody({
                email: 'invalid_email',
            }),
        )

        expect(result.statusCode).toBe(400)
    })
})
