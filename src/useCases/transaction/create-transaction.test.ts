import { jest } from '@jest/globals'
import { CreateTransactionUseCase } from './create-transaction.js'
import type { Transaction } from '../../types/transaction.js'
import { UserNotFoundError } from '../../errors/user.js'
import type { PublicUser } from '../../types/user.js'
import { makeTransaction, makeUser } from '../../tests/fixtures/index.js'

describe('CreateTransactionUseCase', () => {
    const transaction: Transaction = makeTransaction()

    const user = makeUser()
    class CreateTransactionRepositotyStub {
        async execute(transaction: Transaction) {
            return transaction
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId: string): Promise<PublicUser | null> {
            return {
                ...user,
                id: userId,
            }
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const createTransactionRepositoty =
            new CreateTransactionRepositotyStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepositoty,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepositoty,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }

    it('should create transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction)

        expect(result).toEqual({
            ...transaction,
            id: 'generated_id',
        })
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(transaction)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            transaction.user_id,
        )
    })

    it('should call IdGeneratedAdapter ', async () => {
        const { sut, idGeneratorAdapter } = makeSut()

        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        await sut.execute(transaction)

        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })

    it('should call CreateUserRepository with correct params ', async () => {
        const { sut, createTransactionRepositoty } = makeSut()

        const createTransactionRepositotySpy = jest.spyOn(
            createTransactionRepositoty,
            'execute',
        )

        await sut.execute(transaction)

        expect(createTransactionRepositotySpy).toHaveBeenCalledWith({
            ...transaction,
            id: 'generated_id',
        })
    })

    it('should throws UserNotFoundError if user does not exist ', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })
    it('should throw if GetUserByIdRepository throws ', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratedAdapter throws ', async () => {
        const { sut, idGeneratorAdapter } = makeSut()

        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementation(() => {
            throw new Error()
        })

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow()
    })
    it('should throw if CreateTransactionRepositoty throws ', async () => {
        const { sut, createTransactionRepositoty } = makeSut()

        jest.spyOn(
            createTransactionRepositoty,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow()
    })
})
