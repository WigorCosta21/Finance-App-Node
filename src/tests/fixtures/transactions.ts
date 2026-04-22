import { faker } from '@faker-js/faker'
import type { Transaction } from '../../types/transaction.js'

export const transaction: Transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toString(),
    amount: Number(faker.finance.amount()),
    type: 'EARNING',
}
