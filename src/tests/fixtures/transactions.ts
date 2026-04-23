import { faker } from '@faker-js/faker'
import type { Transaction } from '../../types/transaction.js'

export const makeTransaction = (
    override?: Partial<Transaction>,
): Transaction => {
    return {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: faker.number.int(),
        type: 'EARNING',
        ...override,
    }
}
