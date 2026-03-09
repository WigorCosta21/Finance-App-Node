import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers/index.js'

import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from '../../useCases/index.js'

import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makeCreateUserController = () => {
    const postgresCreateUserRepository = new PostgresCreateUserRepository()
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()

    const createUserUseCase = new CreateUserUseCase(
        postgresCreateUserRepository,
        postgresGetUserByEmailRepository,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}

export const makeUpdateUserController = () => {
    const updateUserRepository = new PostgresUpdateUserRepository()

    const getUserByEmail = new PostgresGetUserByEmailRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        updateUserRepository,
        getUserByEmail,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    return deleteUserController
}
