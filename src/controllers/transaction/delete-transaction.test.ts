import type { Request } from 'express'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type {
    Transaction,
    TransactionIdParams,
} from '../../types/transaction.js'
import { DeleteTransactionController } from './delete-transaction.js'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute(): Promise<Transaction | null> {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime.toString(),
                amount: Number(faker.finance.amount()),
                type: 'EARNING',
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
})
