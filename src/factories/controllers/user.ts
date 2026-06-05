import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    UpdateUserController,
    LoginUserController,
    RefreshTokenController,
} from '../../controllers/index.js'

import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
    GetUserByIdUseCase,
    LoginUserUseCase,
    UpdateUserUseCase,
    RefreshTokenUseCase,
} from '../../useCases/index.js'

import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js'

import {
    PasswordHasherAdapter,
    IdGeneratorAdapter,
    PasswordComparatorAdapter,
    TokensGeneratorAdapter,
    TokenVerifierAdapter,
} from '../../adapters/index.js'

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
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()

    const createUserUseCase = new CreateUserUseCase(
        postgresCreateUserRepository,
        postgresGetUserByEmailRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
        tokensGeneratorAdapter,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}

export const makeUpdateUserController = () => {
    const updateUserRepository = new PostgresUpdateUserRepository()

    const getUserByEmail = new PostgresGetUserByEmailRepository()

    const passwordHasherAdapter = new PasswordHasherAdapter()

    const updateUserUseCase = new UpdateUserUseCase(
        updateUserRepository,
        getUserByEmail,
        passwordHasherAdapter,
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

export const makeGetUserBalanceController = () => {
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository()

    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        getUserBalanceRepository,
        getUserByIdRepository,
    )

    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    )

    return getUserBalanceController
}

export const makeLoginUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const passwordComparatorAdapter = new PasswordComparatorAdapter()
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const loginUserUserCase = new LoginUserUseCase(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    )

    const loginUserController = new LoginUserController(loginUserUserCase)

    return loginUserController
}

export const makeRefreshTokenController = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const tokenVerifierAdapter = new TokenVerifierAdapter()
    const refreshTokenUseCase = new RefreshTokenUseCase(
        tokensGeneratorAdapter,
        tokenVerifierAdapter,
    )
    const refreshTokenController = new RefreshTokenController(
        refreshTokenUseCase,
    )

    return refreshTokenController
}
