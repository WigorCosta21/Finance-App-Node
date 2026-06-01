import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import type {
    Transaction,
    UpdateTransactionParams,
} from '../../types/transaction.js'
import { UpdateTransactionUseCase } from './update-transaction.js'
import { makeTransaction } from '../../tests/fixtures/index.js'
import { ForbiddenError } from '../../errors/user.js'

describe('UpdateTransactionUseCase', () => {
    const transaction: Transaction = makeTransaction()
    const userId = transaction.user_id

    class UpdateTransactionRepositoryStub {
        async execute(
            transactionId: string,
            params: UpdateTransactionParams,
        ): Promise<Transaction | null> {
            return {
                ...transaction,
                id: transactionId,
                ...params,
            }
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute(_transactionId: string): Promise<Transaction | null> {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()

        const sut = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            updateTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should update a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction.id, userId, {
            amount: 500,
        })

        expect(result).toMatchObject({
            id: transaction.id,
            amount: 500,
        })
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        await sut.execute(transaction.id, userId, {
            amount: transaction.amount,
        })

        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
            { amount: transaction.amount },
        )
    })

    it('should call GetTransactionByIdRepository with correct params', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()
        const getTransactionByIdSpy = jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        )

        await sut.execute(transaction.id, userId, {
            amount: transaction.amount,
        })

        expect(getTransactionByIdSpy).toHaveBeenCalledWith(transaction.id)
    })

    it('should throw ForbiddenError when transaction does not exist', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()
        jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        ).mockResolvedValueOnce(null)

        const promise = sut.execute(transaction.id, userId, {
            amount: transaction.amount,
        })

        await expect(promise).rejects.toThrow(new ForbiddenError())
    })

    it('should throw ForbiddenError when transaction does not belong to user', async () => {
        const { sut } = makeSut()
        const otherUserId = faker.string.uuid()

        const promise = sut.execute(transaction.id, otherUserId, {
            amount: transaction.amount,
        })

        await expect(promise).rejects.toThrow(new ForbiddenError())
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, userId, {
            amount: transaction.amount,
        })

        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetTransactionByIdRepository throws', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()
        jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, userId, {
            amount: transaction.amount,
        })

        await expect(promise).rejects.toThrow()
    })
})
