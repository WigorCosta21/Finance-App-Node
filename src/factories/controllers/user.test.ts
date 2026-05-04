import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers/index.js'
import {
    makeCreateUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './user.js'

describe('UserControllerFactories', () => {
    it('should returna valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should returna valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })

    it('should returna valid UpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })
})
