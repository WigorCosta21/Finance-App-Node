import { faker } from '@faker-js/faker'
import type { PublicUser, CreateUserParams } from '../../types/user.js'

export const makeUser = (override?: Partial<PublicUser>): PublicUser => ({
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    ...override,
})

export const makeUserParams = (
    override?: Partial<CreateUserParams & { id: string }>,
): CreateUserParams & { id: string } => ({
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
})

export const makeBalance = () => {
    return {
        balance: faker.number.int(),
        earnings: faker.number.int(),
        expenses: faker.number.int(),
        investments: faker.number.int(),
    }
}
