import { faker } from '@faker-js/faker'
import type {
    Transaction,
    CreateTransactionParams,
} from '../../types/transaction.js'

export const makeTransaction = (
    override?: Partial<Transaction>,
): Transaction => ({
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString().slice(0, 10),
    amount: faker.number.int({
        min: 100,
        max: 10000,
    }),
    type: 'EARNING',
    ...override,
})

export const makeTransactionParams = (
    override?: Partial<CreateTransactionParams>,
): CreateTransactionParams => ({
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString().slice(0, 10),
    amount: faker.number.int(),
    type: 'EARNING',
    ...override,
})
