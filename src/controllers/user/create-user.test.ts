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

    it('should return 201 when create a user successfully', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            },
        } as Request<unknown, unknown, CreateUserParams>

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).not.toBeNull()
    })

    it('should return 400 if first_name is not provided', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            },
        } as Request<unknown, unknown, CreateUserParams>

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if last_name is not provided', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            },
        } as Request<unknown, unknown, CreateUserParams>

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if email is not provided', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password({
                    length: 7,
                }),
            },
        } as Request<unknown, unknown, CreateUserParams>

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if email is not valid', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: 'invalid-email',
                password: faker.internet.password({
                    length: 7,
                }),
            },
        } as Request<unknown, unknown, CreateUserParams>

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if password is not provider', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            },
        } as Request<unknown, unknown, CreateUserParams>

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if password is less than 6 characters', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 3,
                }),
            },
        } as Request<unknown, unknown, CreateUserParams>

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: 'First Name Test',
                last_name: 'Last Name Test',
                email: 'test@email.com',
                password: '123456',
            },
        } as Request<unknown, unknown, CreateUserParams>

        const executeSpy = jest.spyOn(createUserUseCaseSub, 'execute')

        await createUserController.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: 'First Name Test',
                last_name: 'Last Name Test',
                email: 'test@email.com',
                password: '123456',
            },
        } as Request<unknown, unknown, CreateUserParams>

        jest.spyOn(createUserUseCaseSub, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        const createUserUseCaseSub = new CreateUserUseCaseStub()

        const createUserController = new CreateUserController(
            createUserUseCaseSub,
        )

        const httpRequest = {
            body: {
                first_name: 'First Name Test',
                last_name: 'Last Name Test',
                email: 'test@email.com',
                password: '123456',
            },
        } as Request<unknown, unknown, CreateUserParams>

        jest.spyOn(createUserUseCaseSub, 'execute').mockImplementationOnce(
            () => {
                throw new EmailAlreadyInUseError(httpRequest.body.email)
            },
        )

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})
