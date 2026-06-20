import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type { Transaction } from '../../types/transaction.js'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { makeTransaction } from '../../tests/fixtures/index.js'
import { ForbiddenError } from '../../errors/user.js'

describe('DeleteTransactionUseCase', () => {
    const transactionData = makeTransaction()
    const userId = transactionData.user_id

    class DeleteTransactionRepositoryStub {
        async execute(transactionId: string): Promise<Transaction | null> {
            return {
                ...transactionData,
                id: transactionId,
            }
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute(_transactionId: string): Promise<Transaction | null> {
            return transactionData
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()

        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transactionData.id, userId)

        expect(result).toMatchObject({ id: transactionData.id })
    })

    it('should throw TransactionNotFoundError when transaction does not exist', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()
        jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        ).mockResolvedValueOnce(null)

        const promise = sut.execute(transactionData.id, userId)

        await expect(promise).rejects.toThrow(TransactionNotFoundError)
    })

    it('should throw TransactionNotFoundError when transaction belongs to another user', async () => {
        const { sut } = makeSut()
        const otherUserId = faker.string.uuid()

        const promise = sut.execute(transactionData.id, otherUserId)

        await expect(promise).rejects.toThrow(ForbiddenError)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const spy = jest.spyOn(deleteTransactionRepository, 'execute')

        await sut.execute(transactionData.id, userId)

        expect(spy).toHaveBeenCalledWith(transactionData.id)
    })

    it('should call GetTransactionByIdRepository with correct params', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()
        const spy = jest.spyOn(getTransactionByIdRepository, 'execute')

        await sut.execute(transactionData.id, userId)

        expect(spy).toHaveBeenCalledWith(transactionData.id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transactionData.id, userId)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetTransactionByIdRepository throws', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()
        jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transactionData.id, userId)

        await expect(promise).rejects.toThrow()
    })
})
