import { faker } from '@faker-js/faker'
import type {
    Transaction,
    UpdateTransactionParams,
} from '../../types/transaction.js'
import { UpdateTransactionUseCase } from './update-transaction.js'

describe('UpdateTransactionUseCase', () => {
    const transaction: Transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE',
    }

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
})
