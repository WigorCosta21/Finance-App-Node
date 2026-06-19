import request from 'supertest'
import { app } from '../app.js'
import { makeTransaction } from '../tests/fixtures/transactions.js'
import { makeUserParams } from '../tests/fixtures/user.js'
import { TransactionType } from '../../generated/prisma/enums.js'

describe('Transaction Routes E2E Tests', () => {
    const createUserAndGetToken = async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        return {
            user: createdUser,
            token: createdUser.tokens.accessToken,
        }
    }

    it('POST /api/transactions/me should return 201 when creating a transaction successfully', async () => {
        const { user, token } = await createUserAndGetToken()
        const transaction = makeTransaction()

        const response = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: transaction.name,
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
            })

        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(user.id)
        expect(response.body.type).toBe(transaction.type)
        expect(response.body.amount).toBe(transaction.amount)
    })

    it('GET /api/transactions/me should return 200 when fetching transactions successfully', async () => {
        const { token } = await createUserAndGetToken()
        const transaction = makeTransaction()

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: transaction.name,
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
            })

        const response = await request(app)
            .get('/api/transactions/me?from=2020-01-01&to=2030-12-31')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body[0].id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId/me should return 200 when updating a transaction successfully', async () => {
        const { token } = await createUserAndGetToken()
        const transaction = makeTransaction()

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: transaction.name,
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
            })

        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}/me`)
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 100, type: TransactionType.INVESTMENT })

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe(100)
        expect(response.body.type).toBe('INVESTMENT')
    })

    it('DELETE /api/transactions/:transactionId/me should return 200 when deleting a transaction successfully', async () => {
        const { token } = await createUserAndGetToken()
        const transaction = makeTransaction()

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: transaction.name,
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
            })

        const response = await request(app)
            .delete(`/api/transactions/${createdTransaction.id}/me`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId/me should return 404 when updating a non-existing transaction', async () => {
        const { token } = await createUserAndGetToken()
        const transaction = makeTransaction()

        const response = await request(app)
            .patch(`/api/transactions/${transaction.id}/me`)
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 100, type: TransactionType.INVESTMENT })

        expect(response.status).toBe(403)
    })

    it('DELETE /api/transactions/:transactionId/me should return 404 when deleting a non-existing transaction', async () => {
        const { token } = await createUserAndGetToken()
        const transaction = makeTransaction()

        const response = await request(app)
            .delete(`/api/transactions/${transaction.id}/me`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404)
    })

    it('GET /api/transactions/me should return empty array when user has no transactions', async () => {
        const { token } = await createUserAndGetToken()

        const response = await request(app)
            .get('/api/transactions/me?from=2020-01-01&to=2030-12-31')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
    })
})
