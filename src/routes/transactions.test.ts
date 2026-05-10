import request from 'supertest'
import { app } from '../app.js'
import { makeTransaction } from '../tests/fixtures/transactions.js'
import { makeUserParams } from '../tests/fixtures/user.js'

describe('Transaction Routes E2E Tests', () => {
    it('POST /api/transaction should return 201 when creating a transaction successfully', async () => {
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
})
