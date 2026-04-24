import { PostgresCreateUserRepository } from './create-user.js'
import { makeUserParams } from '../../../tests/fixtures/index.js'
describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        const user = makeUserParams()
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
    })
})
