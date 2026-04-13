import { type Request } from 'express'
import { faker } from '@faker-js/faker'
import type {
    Transaction,
    TransactionIdParams,
    UpdateTransactionParams,
} from '../../types/transaction.js'
import { UpdateTransactionController } from './update-transaction.js'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute(
            _transactionId: string,
            updateTransactionParams: UpdateTransactionParams,
        ): Promise<Transaction | null> {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name:
                    updateTransactionParams.name ??
                    faker.commerce.productName(),
                date:
                    updateTransactionParams.date ??
                    faker.date.anytime.toString(),
                amount:
                    updateTransactionParams.amount ??
                    Number(faker.finance.amount()),
                type: updateTransactionParams.type ?? 'EARNING',
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { updateTransactionUseCase, sut }
    }

    const makeHttpRequestBody = (transactionId?: string, body?: unknown) => {
        return {
            params: {
                transactionId: transactionId ?? faker.string.uuid(),
            },
            body: body ?? {
                name: faker.commerce.productName(),
            },
        } as Request<TransactionIdParams, unknown, UpdateTransactionParams>
    }

    it('should return 200 when updating a transaction successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(makeHttpRequestBody())

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when transaction id is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(makeHttpRequestBody('invalid_id'))

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when unallowed field is provided', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(
            makeHttpRequestBody(faker.string.uuid(), {
                unallowed_field: 'unallowed_field',
            }),
        )

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(
            makeHttpRequestBody(faker.string.uuid(), {
                amount: 'amount_invalid',
            }),
        )

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(
            makeHttpRequestBody(faker.string.uuid(), {
                type: 'type_invalid',
            }),
        )

        expect(response.statusCode).toBe(400)
    })
})
