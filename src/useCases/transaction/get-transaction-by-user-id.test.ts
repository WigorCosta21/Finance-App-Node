import { faker } from '@faker-js/faker'
import type { User } from '../../types/user.js'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
describe('GetTransactionByUserIdUseCase', () => {
    const user: User = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    class GetTransactionByIdUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUsetByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionByIdUserIdRepository =
            new GetTransactionByIdUserIdRepositoryStub()
        const getUsetByIdRepository = new GetUsetByIdRepositoryStub()

        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionByIdUserIdRepository,
            getUsetByIdRepository,
        )

        return {
            sut,
            getTransactionByIdUserIdRepository,
            getUsetByIdRepository,
        }
    }

    it('shout GetTransactionByUserId if successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(user.id)

        expect(result).toEqual([])
    })
})
