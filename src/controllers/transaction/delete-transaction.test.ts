import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type { Transaction } from '../../types/transaction.js'
import { DeleteTransactionController } from './delete-transaction.js'
import { makeTransaction } from '../../tests/fixtures/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('DeleteTransactionController', () => {
    const transaction = makeTransaction()

    class DeleteTransactionUseCaseStub {
        async execute(
            _transactionId: string,
            _userId: string,
        ): Promise<Transaction | null> {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)
        return { sut, deleteTransactionUseCase }
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction.id, faker.string.uuid())

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('invalid_id', faker.string.uuid())

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if TransactionNotFoundError is thrown', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new TransactionNotFoundError(transaction.id),
        )

        const result = await sut.execute(transaction.id, faker.string.uuid())

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteTransactionUseCase throws generic error', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(transaction.id, faker.string.uuid())

        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        const transactionId = transaction.id
        const userId = faker.string.uuid()
        await sut.execute(transactionId, userId)

        expect(executeSpy).toHaveBeenCalledWith(transactionId, userId)
    })
})
