import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance.js'

describe('GetUserBalanceUseCase', () => {
    const userBalance = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
    }

    const balance = {
        balance: faker.number.int(),
        earnings: faker.number.int(),
        expenses: faker.number.int(),
        investments: faker.number.int(),
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return balance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return { sut, getUserBalanceRepository, getUserByIdRepository }
    }

    it('should get user balance successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(userBalance.id)

        expect(result).toEqual(balance)
    })
})
