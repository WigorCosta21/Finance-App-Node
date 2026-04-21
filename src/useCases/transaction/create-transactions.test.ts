import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { CreateTransactionUseCase } from './create-transaction.js'
import type {
    CreateTransactionParams,
    Transaction,
} from '../../types/transaction.js'

describe('CreateTransactionUseCase', () => {
    const transactionParams: CreateTransactionParams = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toString(),
        amount: Number(faker.finance.amount()),
        type: 'EARNING',
    }

    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    class CreateTransactionRepositotyStub {
        async execute(transaction: Transaction) {
            return transaction
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId: string) {
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

        const result = await sut.execute(transactionParams)

        expect(result).toEqual({ ...transactionParams, id: 'generated_id' })
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(transactionParams)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            transactionParams.user_id,
        )
    })

    it('should call IdGeneratedAdapter ', async () => {
        const { sut, idGeneratorAdapter } = makeSut()

        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        await sut.execute(transactionParams)

        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })

    it('should call CreateUserRepository with correct params ', async () => {
        const { sut, createTransactionRepositoty } = makeSut()

        const createTransactionRepositotySpy = jest.spyOn(
            createTransactionRepositoty,
            'execute',
        )

        await sut.execute(transactionParams)

        expect(createTransactionRepositotySpy).toHaveBeenCalledWith({
            ...transactionParams,
            id: 'generated_id',
        })
    })
})
