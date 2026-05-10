import request from 'supertest'
import { app } from '../app.js'
import { makeTransaction } from '../tests/fixtures/transactions.js'
import { makeUserParams } from '../tests/fixtures/user.js'
import { TransactionType } from '../../generated/prisma/enums.js'

describe('Transaction Routes E2E Tests', () => {
    it('POST /api/transactions should return 201 when creating a transaction successfully', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })
        const transaction = makeTransaction()

        const response = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: transaction.id,
            })

        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.type).toBe(transaction.type)
        expect(response.body.amount).toBe(transaction.amount)
    })

    it('GET /api/transactions should returns 200 when fetching transactions successfully', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })
        const transaction = makeTransaction()

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: transaction.id,
            })

        const response = await request(app).get(
            `/api/transactions?userId=${createdUser.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body[0].id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId should returns 200 when updating a transaction successfully', async () => {
        const user = makeUserParams()
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })
        const transaction = makeTransaction()

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: transaction.id,
            })

        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send({ amount: 100, type: TransactionType.INVESTMENT })

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe(100)
        expect(response.body.type).toBe('INVESTMENT')
    })
})
