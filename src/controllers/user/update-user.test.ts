import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { UpdateUserController } from './update-user.js'
import type { PublicUser, UpdateUserParams } from '../../types/user.js'
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

    const makeParams = (
        body?: object,
        userId?: string,
    ): [string, UpdateUserParams] => {
        return [
            userId ?? faker.string.uuid(),
            (body ?? {
                first_name: faker.person.firstName(),
            }) as UpdateUserParams,
        ]
    }

    it('should return 200 when updating an user successfully', async () => {
        const { sut } = makeSut()
        const [userId, params] = makeParams()

        const response = await sut.execute(userId, params)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when an invalid email is provided', async () => {
        const { sut } = makeSut()
        const [userId, params] = makeParams({ email: 'invalid_email' })

        const result = await sut.execute(userId, params)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid password is provided', async () => {
        const { sut } = makeSut()
        const [userId, params] = makeParams({
            password: faker.internet.password({ length: 5 }),
        })

        const result = await sut.execute(userId, params)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid id is provided', async () => {
        const { sut } = makeSut()
        const [, params] = makeParams(undefined, 'invalid_id')

        const result = await sut.execute('invalid_id', params)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an unallowed_field is provided', async () => {
        const { sut } = makeSut()
        const [userId, params] = makeParams({
            unallowed_field: 'unallowed_field',
        })

        const result = await sut.execute(userId, params)

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const [userId, params] = makeParams()
        const result = await sut.execute(userId, params)

        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(faker.internet.email()),
        )

        const [userId, params] = makeParams()
        const result = await sut.execute(userId, params)

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if UpdateUserUseCase throws UserNotFoundError', async () => {
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const [userId, params] = makeParams()
        const result = await sut.execute(userId, params)

        expect(result.statusCode).toBe(404)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        const { sut, updateUserUseCase } = makeSut()
        const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

        const userId = faker.string.uuid()
        const body = { first_name: faker.person.firstName() }

        await sut.execute(userId, body as UpdateUserParams)

        expect(executeSpy).toHaveBeenCalledWith(userId, body)
    })
})
