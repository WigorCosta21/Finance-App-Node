import type { Request } from 'express'
import type { CreateUserParams, PublicUser } from '../../types/user.js'
import { CreateUserController } from './create-user.js'

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
                first_name: 'Name Test',
                last_name: 'Last Name Test',
                email: 'test@email.com',
                password: '12345678',
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
                last_name: 'Last Name Test',
                email: 'test@email.com',
                password: '12345678',
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
                first_name: 'First Name Test',
                email: 'test@email.com',
                password: '12345678',
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
                first_name: 'First Name Test',
                last_name: 'Last Name Test',
                password: '12345678',
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
                first_name: 'First Name Test',
                last_name: 'Last Name Test',
                email: 'test',
                password: '12345678',
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
                first_name: 'First Name Test',
                last_name: 'Last Name Test',
                email: 'test',
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
                first_name: 'First Name Test',
                last_name: 'Last Name Test',
                email: 'test',
                password: '12345',
            },
        } as Request<unknown, unknown, CreateUserParams>

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})
