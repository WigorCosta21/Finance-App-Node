import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type {
    Transaction,
    TransactionIdParams,
} from '../../types/transaction.js'
import { DeleteTransactionController } from './delete-transaction.js'
import { makeTransactionParams } from '../../tests/fixtures/index.js'

describe('DeleteTransactionController', () => {
    const transaction = makeTransactionParams()
    class DeleteTransactionUseCaseStub {
        async execute(transactionId: string): Promise<Transaction | null> {
            return {
                id: transactionId,
                ...transaction,
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()

        const sub = new DeleteTransactionController(deleteTransactionUseCase)

        return { deleteTransactionUseCase, sub }
    }

    const makeHttpRequest = (transactionId?: string) => {
        return {
            params: {
                transactionId: transactionId ?? faker.string.uuid(),
            },
        } as Request<TransactionIdParams>
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        const { sub } = makeSut()

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        const { sub } = makeSut()

        const result = await sub.execute(makeHttpRequest('invalid_id'))

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if transaction is not found', async () => {
        const { sub, deleteTransactionUseCase } = makeSut()

        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        )

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteTransactionUseCase throws', async () => {
        const { sub, deleteTransactionUseCase } = makeSut()

        jest.spyOn(deleteTransactionUseCase, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        const result = await sub.execute(makeHttpRequest())

        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { sub, deleteTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        const transactionId = faker.string.uuid()
        const httpRequest = makeHttpRequest(transactionId)

        await sub.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
