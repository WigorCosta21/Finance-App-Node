import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type {
    Transaction,
    UpdateTransactionParams,
} from '../../types/transaction.js'
import { UpdateTransactionController } from './update-transaction.js'
import { makeTransaction } from '../../tests/fixtures/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute(
            _transactionId: string,
            _userId: string,
            updateTransactionParams: UpdateTransactionParams,
        ): Promise<Transaction | null> {
            return makeTransaction(updateTransactionParams)
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)
        return { updateTransactionUseCase, sut }
    }

    const makeParams = (
        transactionId?: string,
        userId?: string,
        body?: UpdateTransactionParams,
    ) => ({
        transactionId: transactionId ?? faker.string.uuid(),
        userId: userId ?? faker.string.uuid(),
        body: body ?? { name: faker.commerce.productName() },
    })

    it('should return 200 when updating a transaction successfully', async () => {
        const { sut } = makeSut()
        const { transactionId, userId, body } = makeParams()

        const response = await sut.execute(transactionId, userId, body)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when transaction id is invalid', async () => {
        const { sut } = makeSut()
        const { userId, body } = makeParams()

        const response = await sut.execute('invalid_id', userId, body)

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when unallowed field is provided', async () => {
        const { sut } = makeSut()
        const { transactionId, userId } = makeParams()

        const response = await sut.execute(
            transactionId,
            userId,
            // @ts-expect-error testing unallowed field
            { unallowed_field: 'unallowed_field' },
        )

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        const { sut } = makeSut()
        const { transactionId, userId } = makeParams()

        const response = await sut.execute(
            transactionId,
            userId,
            // @ts-expect-error testing invalid amount
            { amount: 'amount_invalid' },
        )

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        const { sut } = makeSut()
        const { transactionId, userId } = makeParams()

        const response = await sut.execute(
            transactionId,
            userId,
            // @ts-expect-error testing invalid type
            { type: 'type_invalid' },
        )

        expect(response.statusCode).toBe(400)
    })

    it('should return 500 if UpdateTransactionUseCase throws', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const { transactionId, userId, body } = makeParams()
        const response = await sut.execute(transactionId, userId, body)

        expect(response.statusCode).toBe(500)
    })

    it('should return 404 if TransactionNotFoundError is thrown', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new TransactionNotFoundError(faker.string.uuid()),
        )

        const { transactionId, userId, body } = makeParams()
        const response = await sut.execute(transactionId, userId, body)

        expect(response.statusCode).toBe(404)
    })

    it('should call UpdateTransactionUseCase with correct values', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

        const { transactionId, userId, body } = makeParams()
        await sut.execute(transactionId, userId, body)

        expect(executeSpy).toHaveBeenCalledWith(transactionId, userId, body)
    })
})
