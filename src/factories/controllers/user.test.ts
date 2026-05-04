import {
    CreateUserController,
    GetUserByIdController,
} from '../../controllers/index.js'
import { makeCreateUserController, makeGetUserByIdController } from './user.js'

describe('UserControllerFactories', () => {
    it('should returna valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should returna valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
