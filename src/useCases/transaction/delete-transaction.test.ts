import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
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

    class DeleteTransactionRepositoryStup {
        async execute(transactionId: string): Promise<Transaction | null> {
            return {
                ...transaction,
                id: transactionId,
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStup()

        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
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

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        await sut.execute(transaction.id)

        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
        )
    })
})
