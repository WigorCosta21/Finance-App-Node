import request from 'supertest'
import { app } from '../app.js'
import { makeUserParams } from '../tests/fixtures/user.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '../../generated/prisma/enums.js'

describe('User Routes E2E Tests', () => {
    const createUserAndGetToken = async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        return {
            user: createdUser,
            token: createdUser.tokens.accessToken,
            rawPassword: user.password,
        }
    }

    it('POST /api/users should return 201 when user is created', async () => {
        const user = makeUserParams()
        const response = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        expect(response.statusCode).toBe(201)
    })

    it('GET /api/users should return 200 when user is found', async () => {
        const { user, token } = await createUserAndGetToken()

        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(user.id)
    })

    it('PATCH /api/users should return 200 when user is updated', async () => {
        const { token } = await createUserAndGetToken()

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const response = await request(app)
            .patch('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send(updateUserParams)

        expect(response.statusCode).toBe(200)
        expect(response.body.first_name).toBe(updateUserParams.first_name)
        expect(response.body.last_name).toBe(updateUserParams.last_name)
        expect(response.body.email).toBe(updateUserParams.email)
        expect(response.body.password).not.toBe(updateUserParams.password)
    })

    it('DELETE /api/users should return 200 when user is deleted', async () => {
        const { user, token } = await createUserAndGetToken()

        const response = await request(app)
            .delete('/api/users')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toEqual(user.id)
    })

    it('GET /api/users/balance should return 200 and correct balance', async () => {
        const { token } = await createUserAndGetToken()
        const from = '2020-01-01'
        const to = '2030-12-31'
        const dateInRange = '2025-06-15'

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: faker.commerce.productName(),
                date: dateInRange,
                amount: 10000,
                type: TransactionType.EARNING,
            })

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: faker.commerce.productName(),
                date: dateInRange,
                amount: 2000,
                type: TransactionType.EXPENSE,
            })

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: faker.commerce.productName(),
                date: dateInRange,
                amount: 2000,
                type: TransactionType.INVESTMENT,
            })

        const response = await request(app)
            .get(`/api/users/balance?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            earnings: 10000,
            expenses: 2000,
            investments: 2000,
            balance: 6000,
        })
    })

    it('POST /api/users should return 400 when the provided e-mail is already in use', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: createdUser.email,
            })

        expect(response.statusCode).toBe(400)
    })

    it('POST /api/users/login should return 200 and tokens when user credentials are valid', async () => {
        const { user, rawPassword } = await createUserAndGetToken()

        const response = await request(app).post('/api/users/login').send({
            email: user.email,
            password: rawPassword,
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('POST /api/users/refresh-token should return 200 and new tokens when refresh token is valid', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        const response = await request(app)
            .post('/api/users/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })
})
