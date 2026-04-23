import type { Request } from 'express'
import { jest } from '@jest/globals'

import type { CreateUserParams, PublicUser } from '../../types/user.js'
import { CreateUserController } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { makeUser, makeUserParams } from '../../tests/fixtures/index.js'

describe('Create User Controller', () => {
    const user = makeUserParams()
    class CreateUserUseCaseStub {
        async execute(): Promise<PublicUser> {
            return makeUser({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            })
        }
    }

    const makeSut = () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const sut = new CreateUserController(createUserUseCaseSub)

        return { createUserUseCaseSub, sut }
    }

    const makeHttpRequest = (body: unknown) =>
        ({
            body,
        }) as Request<unknown, unknown, CreateUserParams>

    it('should return 201 when create a user successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(makeHttpRequest(user))

        expect(result.statusCode).toBe(201)
        expect(result.body).not.toBeNull()
    })

    it('should return 400 if first_name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...user,
                first_name: null,
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if last_name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...user,
                last_name: null,
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if email is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...user,
                email: null,
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if email is not valid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...user,
                email: 'invalid_email',
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if password is not provider', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...user,
                password: null,
            }),
        )

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if password is less than 6 characters', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            makeHttpRequest({
                ...user,
                password: '123',
            }),
        )

        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        const { sut, createUserUseCaseSub } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCaseSub, 'execute')

        const httpRequest = makeHttpRequest(user)

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

        const httpRequest = makeHttpRequest(user)

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        const { sut, createUserUseCaseSub } = makeSut()

        const httpRequest = makeHttpRequest(user)

        jest.spyOn(createUserUseCaseSub, 'execute').mockImplementationOnce(
            () => {
                throw new EmailAlreadyInUseError(httpRequest.body.email)
            },
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})
