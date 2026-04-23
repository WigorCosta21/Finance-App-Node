import { jest } from '@jest/globals'
import type { Transaction } from '../../types/transaction.js'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { makeTransaction } from '../../tests/fixtures/index.js'

describe('DeleteTransactionUseCase', () => {
    const transactionData = makeTransaction()

    class DeleteTransactionRepositoryStup {
        async execute(transactionId: string): Promise<Transaction | null> {
            return {
                ...transactionData,
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

        const result = await sut.execute(transactionData.id)

        expect(result).toEqual({
            ...transactionData,
            id: transactionData.id,
        })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        await sut.execute(transactionData.id)

        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
            transactionData.id,
        )
    })
    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promisse = sut.execute(transactionData.id)

        await expect(promisse).rejects.toThrow()
    })
})
