import { faker } from '@faker-js/faker'
import type { Transaction } from '../../types/transaction.js'
import { DeleteTransactionUseCase } from './delete-transaction.js'

describe('DeleteTransactionUseCase', () => {
    const transaction: Transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toString(),
        amount: Number(faker.finance.amount()),
        type: 'EARNING',
    }

    class DeleteTransactionUseCaseStup {
        async execute(transactionId: string): Promise<Transaction | null> {
            return {
                ...transaction,
                id: transactionId,
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStup()

        const sut = new DeleteTransactionUseCase(deleteTransactionUseCase)

        return {
            sut,
            deleteTransactionUseCase,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction.id)

        expect(result).toEqual({
            ...transaction,
            id: transaction.id,
        })
    })
})
