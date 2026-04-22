import { faker } from '@faker-js/faker'
import type { User } from '../../../generated/prisma/browser.js'

export const user: User = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
}
