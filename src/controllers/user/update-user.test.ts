import { type Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { UpdateUserController } from './update-user.js'
import type {
    PublicUser,
    UpdateUserParams,
    UserIdParams,
} from '../../types/user.js'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user.js'
import { makeUser } from '../../tests/fixtures/user.js'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(
            _userId: string,
            updateUserParams: UpdateUserParams,
        ): Promise<PublicUser | null> {
            return makeUser(updateUserParams)
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { updateUserUseCase, sut }
    }

    const makeHttpRequest = (body?: unknown, userId?: string) => {
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

        const response = await sut.execute(makeHttpRequest())

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when an invalid email is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                email: 'invalid_email',
            }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid password is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                password: faker.internet.password({ length: 5 }),
            }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid id is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest(undefined, 'invalid_id'),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid id is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest(undefined, 'invalid_id'),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an unallowed_field is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                unallowed_field: 'unallowed_field',
            }) as Request<UserIdParams, unknown, UpdateUserParams>,
        )

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUserCase throws with generic error', async () => {
        const { sut, updateUserUseCase } = makeSut()

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(makeHttpRequest())

        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUserCase throws EmailAlreadyInUseError', async () => {
        const { sut, updateUserUseCase } = makeSut()

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(faker.internet.email()),
        )

        const result = await sut.execute(makeHttpRequest())

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if UpdateUserUserCase throws UserNotFoundError', async () => {
        const { sut, updateUserUseCase } = makeSut()

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const result = await sut.execute(makeHttpRequest())

        expect(result.statusCode).toBe(404)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        const { sut, updateUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

        const userId = faker.string.uuid()
        const body = {
            first_name: faker.person.firstName(),
        }
        const httpResquest = makeHttpRequest(body, userId)

        await sut.execute(httpResquest)

        expect(executeSpy).toHaveBeenCalledWith(userId, body)
    })
})
