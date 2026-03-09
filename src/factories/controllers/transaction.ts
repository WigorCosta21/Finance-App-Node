import { CreateTransactionController } from '../../controllers/index.js'
import {
    PostgresGetUserByIdRepository,
    PostgresCreateTransactionRepository,
} from '../../repositories/postgres/index.js'
import { CreateTransactionUseCase } from '../../useCases/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepositoty = new PostgresGetUserByIdRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepositoty,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}
