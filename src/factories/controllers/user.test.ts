import { GetUserByIdController } from '../../controllers/index.js'
import { makeGetUserByIdController } from './user.js'

describe('UserControllerFactories', () => {
    it('should returna valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })
})
