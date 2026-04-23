import { jest } from '@jest/globals'
import type {
    Transaction,
    UpdateTransactionParams,
} from '../../types/transaction.js'
import { UpdateTransactionUseCase } from './update-transaction.js'
import { makeTransaction } from '../../tests/fixtures/index.js'

describe('UpdateTransactionUseCase', () => {
    const transaction: Transaction = makeTransaction()

    class UpdateTransactionRepositoryStub {
        async execute(
            transactionId: string,
            params: UpdateTransactionParams,
        ): Promise<Transaction | null> {
            return {
                id: transactionId,
                ...params,
            } as Transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()

        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return {
            sut,
            updateTransactionRepository,
        }
    }

    it('should UpdateTransactionUseCase successfully', async () => {
        const { sut } = makeSut()

        const transactionId = transaction.id
        const result = await sut.execute(transactionId, {
            amount: transaction.amount,
        })

        expect(result).toEqual({
            id: transactionId,
            amount: transaction.amount,
        })
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        await sut.execute(transaction.id, {
            amount: Number(transaction.amount),
        })

        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
            {
                amount: Number(transaction.amount),
            },
        )
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, {
            amount: Number(transaction.amount),
        })

        await expect(promise).rejects.toThrow()
    })
})
