import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'

import type { CreateUserParams, PublicUser } from '../../types/user.js'
import { CreateUserController } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        async execute(user: CreateUserParams): Promise<PublicUser> {
            return {
                id: '123',
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }
        }
    }

    const makeSut = () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const sut = new CreateUserController(createUserUseCaseSub)

        return { createUserUseCaseSub, sut }
    }
    const makeHttpRequestBody = () => ({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    })

    const makeHttpRequest = (body: unknown) =>
        ({
            body,
        }) as Request<unknown, unknown, CreateUserParams>

    it('should return 201 when create a user successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(makeHttpRequest(makeHttpRequestBody()))

        expect(result.statusCode).toBe(201)
        expect(result.body).not.toBeNull()
    })

    it('should return 400 if first_name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...makeHttpRequestBody(),
                first_name: null,
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if last_name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...makeHttpRequestBody(),
                last_name: null,
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if email is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...makeHttpRequestBody(),
                email: null,
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if email is not valid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...makeHttpRequestBody(),
                email: 'invalid_email',
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if password is not provider', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...makeHttpRequestBody(),
                password: null,
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if password is less than 6 characters', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...makeHttpRequestBody(),
                password: '123',
            }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        const { sut, createUserUseCaseSub } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCaseSub, 'execute')

        const httpRequest = makeHttpRequest(makeHttpRequestBody())

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        const { sut, createUserUseCaseSub } = makeSut()

        jest.spyOn(createUserUseCaseSub, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        const httpRequest = makeHttpRequest(makeHttpRequestBody())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        const { sut, createUserUseCaseSub } = makeSut()

        const httpRequest = makeHttpRequest(makeHttpRequestBody())

        jest.spyOn(createUserUseCaseSub, 'execute').mockImplementationOnce(
            () => {
                throw new EmailAlreadyInUseError(httpRequest.body.email)
            },
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})
