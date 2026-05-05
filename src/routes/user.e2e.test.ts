import request from 'supertest'
import { app } from '../server.js'
import { makeUserParams } from '../tests/fixtures/user.js'

describe('User Routes E2E Testes', () => {
    const user = makeUserParams()

    it('POST /users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        expect(response.statusCode).toBe(201)
    })
})
