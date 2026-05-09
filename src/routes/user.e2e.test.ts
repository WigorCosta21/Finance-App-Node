import request from 'supertest'
import { app } from '../app.js'
import { makeUserParams } from '../tests/fixtures/user.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '../../generated/prisma/enums.js'

describe('User Routes E2E Testes', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const user = makeUserParams()
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        expect(response.statusCode).toBe(201)
    })

    it('GET /api/users/:userId should return 200 when user is found', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).get(`/api/users/${createdUser.id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(createdUser)
    })

    it('PATCH /api/users/:userId should return 200 when user is updated', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const response = await request(app)
            .patch(`/api/users/${createdUser.id}`)
            .send(updateUserParams)

        expect(response.statusCode).toBe(200)
        expect(response.body.first_name).toBe(updateUserParams.first_name)
        expect(response.body.last_name).toBe(updateUserParams.last_name)
        expect(response.body.email).toBe(updateUserParams.email)
        expect(response.body.password).not.toBe(updateUserParams.password)
    })

    it('DELETE /api/users/:userId should return 200 when user is deleted', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).delete(
            `/api/users/${createdUser.id}`,
        )

        expect(response.statusCode).toBe(200)
    })

    it('GET /api/users/:userId/balance should return 200 and correct balance.', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        await request(app).post('/api/transactions').send({
            user_id: createdUser.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: 10000,
            type: TransactionType.EARNING,
        })

        await request(app).post('/api/transactions').send({
            user_id: createdUser.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: 2000,
            type: TransactionType.EXPENSE,
        })

        await request(app).post('/api/transactions').send({
            user_id: createdUser.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: 2000,
            type: TransactionType.INVESTMENT,
        })

        const response = await request(app).get(
            `/api/users/${createdUser.id}/balance`,
        )

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            earnings: 10000,
            expenses: 2000,
            investments: 2000,
            balance: 6000,
        })
    })

    it('GET /api/users/:userId should return 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}`,
        )

        expect(response.statusCode).toBe(404)
    })

    it('GET /api/users/:userId/balance should return 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}/balance`,
        )

        expect(response.statusCode).toBe(404)
    })

    it('PATCH /api/users/:userId should return 404 when user is not found', async () => {
        const response = await request(app)
            .patch(`/api/users/${faker.string.uuid()}`)
            .send({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            })

        expect(response.statusCode).toBe(404)
    })

    it('POST /api/users should return 400 when the provided e-mail is already in use', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post(`/api/users`)
            .send({
                ...user,
                id: undefined,
                email: createdUser.email,
            })

        expect(response.statusCode).toBe(400)
    })
})
